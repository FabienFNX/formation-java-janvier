# Formation Développement Augmenté Java

Ce projet fait partie d'une formation sur le développement augmenté en Java. Il comprend deux applications Spring Boot qui démontrent l'intégration entre services et l'utilisation d'API REST.

## Projets inclus

### 1. Simulateur de Prêt Immobilier (`loan-simulator`)
Application web avec interface utilisateur pour simuler les mensualités d'un prêt immobilier.

**Fonctionnalités :**
- Interface web intuitive pour saisir les paramètres du prêt
- Calcul des mensualités, coût total et intérêts
- API REST pour les calculs

**Technologies :**
- Spring Boot 3.3.4
- Java 21
- Interface web (HTML/CSS/JavaScript)

### 2. API de Calcul de Taux d'Intérêt (`interest-rate-api`)
API REST qui calcule les taux d'intérêt basés sur des critères sociodémographiques.

**Fonctionnalités :**
- Calcul de taux personnalisé selon l'âge et la catégorie professionnelle
- Documentation API avec Swagger/OpenAPI
- Validation des données d'entrée

**Technologies :**
- Spring Boot 3.3.4
- Java 21
- Spring Boot Validation
- SpringDoc OpenAPI (Swagger)

## Prérequis

- Java 21
- Maven 3.6+

## Installation et lancement

### Démarrage rapide
1. Cloner le repository
2. Naviguer vers le répertoire du projet souhaité
3. Exécuter `mvn spring-boot:run`

### Simulateur de Prêt
```bash
cd loan-simulator
mvn spring-boot:run
```
Application disponible sur : http://localhost:8080

### API de Taux d'Intérêt
```bash
cd interest-rate-api
mvn spring-boot:run
```
- API disponible sur : http://localhost:8081
- Documentation Swagger : http://localhost:8081/swagger-ui.html

## Utilisation

### Simulateur de Prêt
1. Ouvrir http://localhost:8080 dans un navigateur
2. Saisir le montant du prêt, la durée et le taux d'intérêt
3. Cliquer sur "Calculer" pour voir les résultats

### API de Taux d'Intérêt
Exemple d'appel API :
```bash
curl -X POST http://localhost:8081/api/interest-rate \
  -H "Content-Type: application/json" \
  -d '{
    "age": 30,
    "professionalCategory": "EMPLOYEE"
  }'
```

## Tests

Pour chaque projet :
```bash
mvn test
```

## Structure du projet

```
formation-dev-augmente-java/
├── loan-simulator/           # Simulateur de prêt immobilier
│   ├── src/main/java/        # Code source Java
│   ├── src/main/resources/   # Ressources (HTML, CSS, JS)
│   └── pom.xml
├── interest-rate-api/        # API de calcul de taux
│   ├── src/main/java/        # Code source Java
│   └── pom.xml
└── README.md
```

## Développement

Ce projet utilise :
- Spring Boot pour le framework web
- Maven pour la gestion des dépendances
- Git pour le contrôle de version

Les deux applications peuvent être développées et testées indépendamment.

# Hands-on

## Hands-on #1

L'application Web doit permettre à un utilisateur de saisir des informations pour simuler le montant d'un prêt immobilier :
- La durée du prêt
- Le montant du prêt souhaité
- Le taux d'intérêt annuel du prêt

La partie IHM est déjà implémentée, vous devez développer l'api REST qui permettra de traiter les informations fournies par l'utilisateur et de lui retourner le coût de son prêt.

Exemple :
Pour un prêt présentant les caractéristiques suivantes :
- 15 ans
- 300 000€
- 5%
Le coût total du prêt est de 427 028€

## Hands-on #2

L'application web intègre un écran dédié pour un employé d'une agence bancaire,
Il doit pouvoir saisir une nouvelle simulation de crédit immobilier avec les éléments suivants : 
- Nom
- Prénom
- Catégorie d'âge
- Catégorie socio-professionnelle
- Revenu mensuel net
- La durée du prêt
- Le montant du prêt souhaité
Lorsqu'il clique sur calculer le taux va être déterminé à partir des informations obtenues depuis l'API REST qui est disponible dans le projet *interest-rate-api* et dont la description est disponible ici : http://localhost:8081/swagger-ui.html

L'exercice est ici d'implémenter la logique présente dans le backend et d'appeler l'API REST interest-rate-api quand nécessaire

## Hands-on #3

Réalisez les tests unitaires associés au backend Java en dépassant 80% de couverture de tests.

Utilisez les instructions/rules pour rédiger ces tests

## Hands-on #4

L'employé d'agence doit également pouvoir sauvegarder les éléments en base de données afin de pouvoir consulter la liste des dossiers de simulation de prêts qu'il a effectué. 

Pour cela vous pouvez vous appuyer sur le fichier de base de données SQL Lite *loan_simulator.db* et l'exemple de script SQL pour insérer les données *sample_data.sql*
