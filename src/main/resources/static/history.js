document.addEventListener('DOMContentLoaded', function() {
    // Éléments du DOM
    const searchInput = document.getElementById('searchClient');
    const filterAge = document.getElementById('filterAge');
    const filterProfession = document.getElementById('filterProfession');
    const searchBtn = document.getElementById('searchBtn');
    const clearBtn = document.getElementById('clearBtn');
    const refreshBtn = document.getElementById('refreshBtn');
    const loadingDiv = document.getElementById('loading');
    const errorDiv = document.getElementById('error');
    const simulationsTable = document.getElementById('simulationsTable');
    const simulationsBody = document.getElementById('simulationsBody');
    const noSimulationsDiv = document.getElementById('noSimulations');
    const totalCountSpan = document.getElementById('totalCount');
    const displayedCountSpan = document.getElementById('displayedCount');

    // Modal
    const modal = document.getElementById('detailModal');
    const modalBody = document.getElementById('modalBody');
    const closeModal = document.getElementsByClassName('close')[0];
    const closeModalBtn = document.getElementById('closeModalBtn');
    const deleteBtn = document.getElementById('deleteBtn');

    // Variables
    let allSimulations = [];
    let filteredSimulations = [];
    let currentSimulation = null;

    // Initialisation
    init();

    // Event listeners
    searchBtn.addEventListener('click', filterSimulations);
    clearBtn.addEventListener('click', clearFilters);
    refreshBtn.addEventListener('click', loadSimulations);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            filterSimulations();
        }
    });

    closeModal.addEventListener('click', hideModal);
    closeModalBtn.addEventListener('click', hideModal);
    deleteBtn.addEventListener('click', confirmDelete);

    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            hideModal();
        }
    });

    async function init() {
        await Promise.all([
            loadCategories(),
            loadSimulations()
        ]);
    }

    async function loadCategories() {
        try {
            const [ageResponse, professionalResponse] = await Promise.all([
                fetch('/api/age-categories'),
                fetch('/api/professional-categories')
            ]);

            if (ageResponse.ok && professionalResponse.ok) {
                const ageCategories = await ageResponse.json();
                const professionalCategories = await professionalResponse.json();

                populateFilter(filterAge, ageCategories);
                populateFilter(filterProfession, professionalCategories);
            }
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }

    function populateFilter(selectElement, categories) {
        selectElement.innerHTML = '<option value="">-- Toutes --</option>';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.code;
            option.textContent = category.name;
            selectElement.appendChild(option);
        });
    }

    async function loadSimulations() {
        setLoading(true);
        hideError();

        try {
            const response = await fetch('/api/saved-simulations');

            if (!response.ok) {
                throw new Error('Erreur lors du chargement des simulations');
            }

            allSimulations = await response.json();
            filteredSimulations = [...allSimulations];

            displaySimulations();
            updateStats();
        } catch (error) {
            showError('Impossible de charger les simulations: ' + error.message);
            console.error('Error loading simulations:', error);
        } finally {
            setLoading(false);
        }
    }

    function filterSimulations() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const ageFilter = filterAge.value;
        const professionFilter = filterProfession.value;

        filteredSimulations = allSimulations.filter(simulation => {
            const matchesSearch = !searchTerm ||
                simulation.clientName.toLowerCase().includes(searchTerm);

            const matchesAge = !ageFilter ||
                simulation.ageCategory === ageFilter;

            const matchesProfession = !professionFilter ||
                simulation.professionalCategory === professionFilter;

            return matchesSearch && matchesAge && matchesProfession;
        });

        displaySimulations();
        updateStats();
    }

    function clearFilters() {
        searchInput.value = '';
        filterAge.value = '';
        filterProfession.value = '';
        filteredSimulations = [...allSimulations];
        displaySimulations();
        updateStats();
    }

    function displaySimulations() {
        simulationsBody.innerHTML = '';

        if (filteredSimulations.length === 0) {
            simulationsTable.style.display = 'none';
            noSimulationsDiv.style.display = 'block';
            return;
        }

        simulationsTable.style.display = 'table';
        noSimulationsDiv.style.display = 'none';

        filteredSimulations.forEach(simulation => {
            const row = createSimulationRow(simulation);
            simulationsBody.appendChild(row);
        });
    }

    function createSimulationRow(simulation) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${simulation.id}</td>
            <td class="client-name">${simulation.clientName}</td>
            <td class="date">${simulation.formattedCreatedAt}</td>
            <td class="amount">${formatCurrency(simulation.loanAmount)}</td>
            <td>${simulation.durationYears} ans</td>
            <td class="rate">${simulation.annualInterestRate.toFixed(2)}%</td>
            <td class="monthly-payment">${formatCurrency(simulation.monthlyPayment)}</td>
            <td class="profile">
                ${getCategoryName(filterAge, simulation.ageCategory)}<br>
                <small>${getCategoryName(filterProfession, simulation.professionalCategory)}</small>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="view-btn" onclick="viewSimulation(${simulation.id})">👁️ Voir</button>
                    <button class="delete-btn" onclick="deleteSimulation(${simulation.id})">🗑️</button>
                </div>
            </td>
        `;
        return row;
    }

    function getCategoryName(selectElement, code) {
        const option = selectElement.querySelector(`option[value="${code}"]`);
        return option ? option.textContent : code;
    }

    function updateStats() {
        totalCountSpan.textContent = allSimulations.length;
        displayedCountSpan.textContent = filteredSimulations.length;
    }

    async function viewSimulation(id) {
        try {
            const response = await fetch(`/api/saved-simulations/${id}`);

            if (!response.ok) {
                throw new Error('Simulation non trouvée');
            }

            currentSimulation = await response.json();
            showSimulationDetails(currentSimulation);
        } catch (error) {
            showError('Impossible de charger les détails: ' + error.message);
        }
    }

    function showSimulationDetails(simulation) {
        modalBody.innerHTML = `
            <div class="simulation-detail">
                <div class="detail-section">
                    <h4>👤 Informations Client</h4>
                    <div class="detail-row">
                        <span class="detail-label">Nom complet:</span>
                        <span class="detail-value">${simulation.firstName} ${simulation.lastName}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Catégorie d'âge:</span>
                        <span class="detail-value">${getCategoryName(filterAge, simulation.ageCategory)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Catégorie professionnelle:</span>
                        <span class="detail-value">${getCategoryName(filterProfession, simulation.professionalCategory)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Revenu mensuel net:</span>
                        <span class="detail-value">${formatCurrency(simulation.monthlyNetIncome)}</span>
                    </div>
                </div>

                <div class="detail-section">
                    <h4>💰 Paramètres du Prêt</h4>
                    <div class="detail-row">
                        <span class="detail-label">Montant emprunté:</span>
                        <span class="detail-value">${formatCurrency(simulation.loanAmount)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Durée:</span>
                        <span class="detail-value">${simulation.durationYears} années</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Taux d'intérêt annuel:</span>
                        <span class="detail-value">${simulation.annualInterestRate.toFixed(2)}%</span>
                    </div>
                </div>

                <div class="detail-section">
                    <h4>📊 Résultats de la Simulation</h4>
                    <div class="detail-row">
                        <span class="detail-label">Mensualité:</span>
                        <span class="detail-value">${formatCurrency(simulation.monthlyPayment)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Coût total des intérêts:</span>
                        <span class="detail-value">${formatCurrency(simulation.totalInterest)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Coût total du prêt:</span>
                        <span class="detail-value"><strong>${formatCurrency(simulation.totalCost)}</strong></span>
                    </div>
                </div>

                <div class="detail-section">
                    <h4>📅 Informations de Suivi</h4>
                    <div class="detail-row">
                        <span class="detail-label">ID de la simulation:</span>
                        <span class="detail-value">${simulation.id}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Date de création:</span>
                        <span class="detail-value">${new Date(simulation.createdAt).toLocaleString('fr-FR')}</span>
                    </div>
                </div>
            </div>
        `;

        modal.style.display = 'block';
    }

    function hideModal() {
        modal.style.display = 'none';
        currentSimulation = null;
    }

    function confirmDelete() {
        if (!currentSimulation) return;

        if (confirm(`Êtes-vous sûr de vouloir supprimer la simulation pour ${currentSimulation.firstName} ${currentSimulation.lastName} ?`)) {
            performDelete(currentSimulation.id);
        }
    }

    async function performDelete(id) {
        try {
            const response = await fetch(`/api/saved-simulations/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Impossible de supprimer la simulation');
            }

            // Retirer de la liste locale
            allSimulations = allSimulations.filter(s => s.id !== id);
            filteredSimulations = filteredSimulations.filter(s => s.id !== id);

            displaySimulations();
            updateStats();
            hideModal();

            // Afficher un message de succès temporaire
            showSuccess('Simulation supprimée avec succès');
        } catch (error) {
            showError('Erreur lors de la suppression: ' + error.message);
        }
    }

    function setLoading(isLoading) {
        loadingDiv.style.display = isLoading ? 'block' : 'none';
        simulationsTable.style.display = isLoading ? 'none' : 'table';
        noSimulationsDiv.style.display = 'none';
    }

    function showError(message) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        errorDiv.scrollIntoView({ behavior: 'smooth' });
    }

    function hideError() {
        errorDiv.style.display = 'none';
    }

    function showSuccess(message) {
        // Créer un message de succès temporaire
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
            border-radius: 8px;
            padding: 12px 20px;
            z-index: 1001;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(successDiv);

        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }

    function formatCurrency(amount) {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount);
    }

    // Exposer les fonctions globalement pour les boutons
    window.viewSimulation = viewSimulation;
    window.deleteSimulation = function(id) {
        const simulation = allSimulations.find(s => s.id === id);
        if (simulation) {
            currentSimulation = simulation;
            confirmDelete();
        }
    };
});