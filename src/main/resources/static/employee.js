document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('employeeLoanForm');
    const resultDiv = document.getElementById('result');
    const errorDiv = document.getElementById('error');
    const ageCategorySelect = document.getElementById('ageCategory');
    const professionalCategorySelect = document.getElementById('professionalCategory');
    const saveButton = document.getElementById('saveSimulationBtn');
    const saveSuccessDiv = document.getElementById('saveSuccess');

    // Variables pour stocker la dernière simulation
    let lastSimulationRequest = null;
    let lastSimulationResponse = null;

    // Charger les catégories au démarrage
    loadCategories();

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        await calculateLoan();
    });

    saveButton.addEventListener('click', async function() {
        await saveSimulation();
    });

    async function loadCategories() {
        try {
            // Charger les catégories d'âge et professionnelles en parallèle
            const [ageResponse, professionalResponse] = await Promise.all([
                fetch('/api/age-categories'),
                fetch('/api/professional-categories')
            ]);

            if (ageResponse.ok && professionalResponse.ok) {
                const ageCategories = await ageResponse.json();
                const professionalCategories = await professionalResponse.json();

                populateSelect(ageCategorySelect, ageCategories);
                populateSelect(professionalCategorySelect, professionalCategories);
            } else {
                showError('Erreur lors du chargement des catégories. Veuillez actualiser la page.');
            }
        } catch (error) {
            console.error('Error loading categories:', error);
            showError('Impossible de charger les catégories. Vérifiez votre connexion.');
        }
    }

    function populateSelect(selectElement, categories) {
        // Vider le select (garder seulement la première option)
        selectElement.innerHTML = '<option value="">-- Sélectionnez --</option>';

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.code;
            option.textContent = `${category.name} - ${category.description}`;
            option.setAttribute('data-modifier', category.rateModifier);
            selectElement.appendChild(option);
        });
    }

    async function calculateLoan() {
        hideMessages();
        setLoading(true);

        const formData = new FormData(form);
        const loanRequest = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            ageCategory: formData.get('ageCategory'),
            professionalCategory: formData.get('professionalCategory'),
            monthlyNetIncome: parseFloat(formData.get('monthlyNetIncome')),
            amount: parseFloat(formData.get('amount')),
            durationYears: parseInt(formData.get('duration'))
            // annualInterestRate est null - sera calculé automatiquement
        };

        const validation = validateEmployeeInput(loanRequest);
        if (!validation.isValid) {
            setLoading(false);
            const errorMessage = 'Erreurs de saisie :\n• ' + validation.errors.join('\n• ');
            showError(errorMessage);
            return;
        }

        try {
            const response = await fetch('/api/calculate-loan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loanRequest)
            });

            if (!response.ok) {
                throw new Error('Erreur lors du calcul');
            }

            const result = await response.json();
            // Sauvegarder pour utilisation ultérieure
            lastSimulationRequest = loanRequest;
            lastSimulationResponse = result;
            displayEmployeeResult(result, loanRequest);
        } catch (error) {
            showError('Une erreur est survenue lors du calcul. Veuillez réessayer.');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    }

    function validateEmployeeInput(data) {
        const errors = [];

        if (!data.firstName || data.firstName.trim() === '') {
            errors.push('Le prénom est obligatoire');
        }

        if (!data.lastName || data.lastName.trim() === '') {
            errors.push('Le nom est obligatoire');
        }

        if (!data.ageCategory || data.ageCategory === '') {
            errors.push('La catégorie d\'âge doit être sélectionnée');
        }

        if (!data.professionalCategory || data.professionalCategory === '') {
            errors.push('La catégorie professionnelle doit être sélectionnée');
        }

        if (!data.monthlyNetIncome || data.monthlyNetIncome <= 0) {
            errors.push('Le revenu mensuel net doit être supérieur à 0€');
        }

        if (!data.amount || data.amount <= 0) {
            errors.push('Le montant du prêt doit être supérieur à 0€');
        }

        if (!data.durationYears || data.durationYears <= 0) {
            errors.push('La durée du prêt doit être supérieure à 0 année');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    function displayEmployeeResult(result, request) {
        // Informations client
        document.getElementById('clientName').textContent = `${request.firstName} ${request.lastName}`;

        const ageOption = ageCategorySelect.querySelector(`option[value="${request.ageCategory}"]`);
        const profOption = professionalCategorySelect.querySelector(`option[value="${request.professionalCategory}"]`);

        document.getElementById('clientProfile').textContent =
            `${ageOption.textContent.split(' - ')[0]} • ${profOption.textContent.split(' - ')[0]}`;

        document.getElementById('clientIncome').textContent = formatCurrency(request.monthlyNetIncome);

        // Taux appliqué
        document.getElementById('appliedRate').textContent = `${result.annualInterestRate.toFixed(2)}%`;

        // Détail du calcul (si on avait accès aux composants du taux)
        displayRateCalculation(result.annualInterestRate, ageOption, profOption);

        // Résultats financiers
        document.getElementById('loanAmount').textContent = formatCurrency(result.loanAmount);
        document.getElementById('monthlyPayment').textContent = formatCurrency(result.monthlyPayment);
        document.getElementById('totalInterest').textContent = formatCurrency(result.totalInterest);
        document.getElementById('totalCost').textContent = formatCurrency(result.totalCost);

        // Afficher le bouton de sauvegarde
        saveButton.style.display = 'inline-block';
        saveSuccessDiv.style.display = 'none';

        resultDiv.style.display = 'block';
        resultDiv.scrollIntoView({ behavior: 'smooth' });
    }

    function displayRateCalculation(finalRate, ageOption, profOption) {
        const ageModifier = parseFloat(ageOption.getAttribute('data-modifier'));
        const profModifier = parseFloat(profOption.getAttribute('data-modifier'));

        // Estimation du taux de base (approximation)
        const estimatedBaseRate = 1.5;

        const calculationDiv = document.getElementById('rateCalculation');
        calculationDiv.innerHTML = `
            <div class="rate-breakdown">
                <div class="rate-component">
                    <span>Taux de base:</span>
                    <span>${estimatedBaseRate.toFixed(2)}%</span>
                </div>
                <div class="rate-component">
                    <span>Ajustement âge (${ageOption.textContent.split(' - ')[0]}):</span>
                    <span>${ageModifier >= 0 ? '+' : ''}${ageModifier.toFixed(2)}%</span>
                </div>
                <div class="rate-component">
                    <span>Ajustement profession (${profOption.textContent.split(' - ')[0]}):</span>
                    <span>${profModifier >= 0 ? '+' : ''}${profModifier.toFixed(2)}%</span>
                </div>
                <div class="rate-component">
                    <span>Ajustement revenu:</span>
                    <span>Calculé automatiquement</span>
                </div>
                <div class="rate-component">
                    <span><strong>Taux final:</strong></span>
                    <span><strong>${finalRate.toFixed(2)}%</strong></span>
                </div>
            </div>
        `;
    }

    function setLoading(isLoading) {
        const button = form.querySelector('.calculate-btn');
        const calculateText = document.getElementById('calculateText');
        const loadingText = document.getElementById('loadingText');

        button.disabled = isLoading;
        calculateText.style.display = isLoading ? 'none' : 'inline';
        loadingText.style.display = isLoading ? 'inline' : 'none';
    }

    function showError(message) {
        // Convertir les \n en <br> pour l'affichage HTML
        errorDiv.innerHTML = message.replace(/\n/g, '<br>');
        errorDiv.style.display = 'block';
        errorDiv.scrollIntoView({ behavior: 'smooth' });
    }

    async function saveSimulation() {
        if (!lastSimulationRequest || !lastSimulationResponse) {
            showError('Aucune simulation à sauvegarder. Veuillez d\'abord calculer un prêt.');
            return;
        }

        setSaveLoading(true);
        saveSuccessDiv.style.display = 'none';
        errorDiv.style.display = 'none';

        try {
            const saveRequest = {
                loanRequest: lastSimulationRequest,
                loanResponse: lastSimulationResponse
            };

            const response = await fetch('/api/save-simulation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(saveRequest)
            });

            if (!response.ok) {
                if (response.status === 400) {
                    throw new Error('Données insuffisantes pour sauvegarder la simulation');
                }
                throw new Error('Erreur lors de la sauvegarde');
            }

            const result = await response.json();
            showSaveSuccess();
            console.log('Simulation saved with ID:', result.id);
        } catch (error) {
            showError('Erreur lors de la sauvegarde: ' + error.message);
            console.error('Save error:', error);
        } finally {
            setSaveLoading(false);
        }
    }

    function setSaveLoading(isLoading) {
        const saveText = document.getElementById('saveText');
        const savingText = document.getElementById('savingText');

        saveButton.disabled = isLoading;
        saveText.style.display = isLoading ? 'none' : 'inline';
        savingText.style.display = isLoading ? 'inline' : 'none';
    }

    function showSaveSuccess() {
        saveSuccessDiv.style.display = 'block';
        saveButton.style.display = 'none';
        setTimeout(() => {
            saveSuccessDiv.style.display = 'none';
            saveButton.style.display = 'inline-block';
        }, 3000);
    }

    function hideMessages() {
        resultDiv.style.display = 'none';
        errorDiv.style.display = 'none';
        saveSuccessDiv.style.display = 'none';
        saveButton.style.display = 'none';
    }

    function formatCurrency(amount) {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount);
    }
});