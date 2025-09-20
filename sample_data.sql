-- Sample data for loan simulations
-- Clear existing data first
DELETE FROM loan_simulations;

-- Reset the auto-increment counter
DELETE FROM sqlite_sequence WHERE name='loan_simulations';

-- Insert 20 sample loan simulations
INSERT INTO loan_simulations (
    first_name, last_name, age_category, professional_category,
    monthly_net_income, loan_amount, duration_years, annual_interest_rate,
    total_interest, total_cost, monthly_payment, created_at
) VALUES
-- Sample 1: Young professional
('Marie', 'Dubois', 'YOUNG', 'EXECUTIVE', 4500.0, 250000.0, 25, 2.8,
 87654.32, 337654.32, 1125.81, datetime('2024-01-15 10:30:00')),

-- Sample 2: Senior executive
('Jean', 'Martin', 'ADULT', 'EXECUTIVE', 6500.0, 400000.0, 20, 2.5,
 105263.16, 505263.16, 2105.26, datetime('2024-02-20 14:15:00')),

-- Sample 3: Young employee
('Sophie', 'Bernard', 'YOUNG', 'EMPLOYEE', 2800.0, 180000.0, 25, 3.2,
 72840.96, 252840.96, 844.47, datetime('2024-03-10 09:45:00')),

-- Sample 4: Senior manager
('Pierre', 'Moreau', 'SENIOR', 'EXECUTIVE', 5200.0, 320000.0, 15, 2.3,
 59904.61, 379904.61, 2110.59, datetime('2024-04-05 16:20:00')),

-- Sample 5: Adult employee
('Isabelle', 'Petit', 'ADULT', 'EMPLOYEE', 3200.0, 200000.0, 22, 3.0,
 70909.09, 270909.09, 1030.67, datetime('2024-05-12 11:00:00')),

-- Sample 6: Young executive
('Thomas', 'Durand', 'YOUNG', 'EXECUTIVE', 4200.0, 230000.0, 25, 2.9,
 82045.45, 312045.45, 1040.15, datetime('2024-06-18 13:30:00')),

-- Sample 7: Senior employee
('Catherine', 'Leroy', 'SENIOR', 'EMPLOYEE', 3800.0, 220000.0, 18, 2.8,
 58181.82, 278181.82, 1287.84, datetime('2024-07-22 08:15:00')),

-- Sample 8: Adult executive
('Nicolas', 'Roux', 'ADULT', 'EXECUTIVE', 5500.0, 350000.0, 20, 2.6,
 94736.84, 444736.84, 1853.07, datetime('2024-08-14 15:45:00')),

-- Sample 9: Young employee
('Julie', 'Vincent', 'YOUNG', 'EMPLOYEE', 2900.0, 160000.0, 25, 3.3,
 66181.82, 226181.82, 754.61, datetime('2024-09-03 10:20:00')),

-- Sample 10: Senior executive
('Alain', 'Fournier', 'SENIOR', 'EXECUTIVE', 7200.0, 450000.0, 18, 2.4,
 103636.36, 553636.36, 2575.76, datetime('2024-10-07 12:00:00')),

-- Sample 11: Adult employee
('Céline', 'Michel', 'ADULT', 'EMPLOYEE', 3400.0, 190000.0, 20, 3.1,
 61052.63, 251052.63, 1046.05, datetime('2024-11-11 14:30:00')),

-- Sample 12: Young executive
('Laurent', 'Garcia', 'YOUNG', 'EXECUTIVE', 4800.0, 280000.0, 22, 2.7,
 84363.64, 364363.64, 1378.74, datetime('2024-12-15 09:00:00')),

-- Sample 13: Senior employee
('Monique', 'David', 'SENIOR', 'EMPLOYEE', 4000.0, 240000.0, 20, 2.9,
 74526.32, 314526.32, 1309.68, datetime('2025-01-08 16:45:00')),

-- Sample 14: Adult executive
('François', 'Bertrand', 'ADULT', 'EXECUTIVE', 6000.0, 380000.0, 25, 2.6,
 130526.32, 510526.32, 1701.75, datetime('2025-02-12 11:15:00')),

-- Sample 15: Young employee
('Sandrine', 'Simon', 'YOUNG', 'EMPLOYEE', 3100.0, 170000.0, 23, 3.2,
 60869.57, 230869.57, 834.42, datetime('2025-03-20 13:20:00')),

-- Sample 16: Senior executive
('Gérard', 'Laurent', 'SENIOR', 'EXECUTIVE', 8500.0, 500000.0, 15, 2.2,
 87368.42, 587368.42, 3262.60, datetime('2025-04-25 10:50:00')),

-- Sample 17: Adult employee
('Nathalie', 'Lefebvre', 'ADULT', 'EMPLOYEE', 3600.0, 210000.0, 25, 3.0,
 79736.84, 289736.84, 965.79, datetime('2025-05-30 15:10:00')),

-- Sample 18: Young executive
('Christophe', 'Morel', 'YOUNG', 'EXECUTIVE', 4600.0, 260000.0, 20, 2.8,
 76842.11, 336842.11, 1403.51, datetime('2025-06-14 08:40:00')),

-- Sample 19: Senior employee
('Brigitte', 'Andre', 'SENIOR', 'EMPLOYEE', 4200.0, 250000.0, 18, 2.7,
 68421.05, 318421.05, 1480.10, datetime('2025-07-18 12:25:00')),

-- Sample 20: Adult executive
('Stéphane', 'Girard', 'ADULT', 'EXECUTIVE', 5800.0, 360000.0, 22, 2.5,
 99473.68, 459473.68, 1737.77, datetime('2025-08-22 14:55:00'));