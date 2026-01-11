-- 1. Δημιουργία Τμημάτων (Classrooms)
INSERT INTO classrooms (name, grade) VALUES ('Α1', 1);
INSERT INTO classrooms (name, grade) VALUES ('Α2', 1);
INSERT INTO classrooms (name, grade) VALUES ('Β1', 2);
INSERT INTO classrooms (name, grade) VALUES ('Β2', 2);
INSERT INTO classrooms (name, grade) VALUES ('Γ1', 3);

-- 2. Δημιουργία 30 Μαθητών μοιρασμένων στα τμήματα
-- Τμήμα Α1 (classroom_id = 1)
INSERT INTO students (first_name, last_name, email, classroom_id) VALUES ('Γιώργος', 'Παπαδόπουλος', 'student1@school.gr', 1);
INSERT INTO students (first_name, last_name, email, classroom_id) VALUES ('Μαρία', 'Γεωργίου', 'student2@school.gr', 1);
INSERT INTO students (first_name, last_name, email, classroom_id) VALUES ('Νίκος', 'Ιωάννου', 'student3@school.gr', 1);
INSERT INTO students (first_name, last_name, email, classroom_id) VALUES ('Ελένη', 'Δημητρίου', 'student4@school.gr', 1);
INSERT INTO students (first_name, last_name, email, classroom_id) VALUES ('Κώστας', 'Νικολάου', 'student5@school.gr', 1);
INSERT INTO students (first_name, last_name, email, classroom_id) VALUES ('Άννα', 'Κωνσταντίνου', 'student6@school.gr', 1);

-- Τμήμα Α2 (classroom_id = 2)
INSERT INTO students (first_name, last_name, email, classroom_id) VALUES ('Δημήτρης', 'Σιδηρόπουλος', 'student7@school.gr', 2);
INSERT INTO students (first_name, last_name, email, classroom_id) VALUES ('Κατερίνα', 'Μιχαηλίδης', 'student8@school.gr', 2);
INSERT INTO students (first_name, last_name, email, classroom_id) VALUES ('Γιάννης', 'Βασιλείου', 'student9@school.gr', 2);
INSERT INTO students (first_name, last_name, email, classroom_id) VALUES ('Σοφία', 'Αγγελίδη', 'student10@school.gr', 2);
INSERT INTO students (first_name, last_name, email, classroom_id) VALUES ('Μιχάλης', 'Παπαδάκης', 'student11@school.gr', 2);
INSERT INTO students (first_name, last_name, email, classroom_id) VALUES ('Χριστίνα', 'Λαμπρίδου', 'student12@school.gr', 2);

-- Τμήμα Β1 (classroom_id = 3)
INSERT INTO students (first_name, last_name, email, classroom_id) VALUES ('Ανδρέας', 'Φωτίου', 'student13@school.gr', 3);
INSERT INTO students (first_name, last_name, email, classroom_id) VALUES ('Βασιλική', 'Σάββα', 'student14@school.gr', 3);
INSERT INTO students (first_name, last_name, email, classroom_id) VALUES ('Παναγιώτης', 'Χρήστου', 'student15@school.gr', 3);
INSERT INTO students (first_name, last_name, email, classroom_id) VALUES ('Ειρήνη', 'Μάρκου', 'student16@school.gr', 3);
INSERT INTO students (first_name, last_name, email, classroom_id) VALUES ('Στέλιος', 'Ρούσσος', 'student17@school.gr', 3);
INSERT INTO students (first_name, last_name, email, classroom_id) VALUES ('Δέσποινα', 'Πέτρου', 'student18@school.gr', 3);

-- Τμήμα Β2 (classroom_id = 4)
INSERT INTO students (first_name, last_name, email, classroom_id) VALUES ('Φώτης', 'Ηλία', 'student19@school.gr', 4);
INSERT INTO students (first_name, last_name, email, classroom_id) VALUES ('Όλγα', 'Κυριάκου', 'student20@school.gr', 4);
INSERT INTO students (first_name, last_name, email, classroom_id) VALUES ('Αλέξανδρος', 'Θεοδώρου', 'student21@school.gr', 4);
INSERT INTO students (first_name, last_name, email, classroom_id) VALUES ('Νεφέλη', 'Στεφάνου', 'student22@school.gr', 4);
INSERT INTO students (first_name, last_name, email, classroom_id) VALUES ('Θωμάς', 'Αντωνίου', 'student23@school.gr', 4);
INSERT INTO students (first_name, last_name, email, classroom_id) VALUES ('Ευγενία', 'Παύλου', 'student24@school.gr', 4);

-- Τμήμα Γ1 (classroom_id = 5)
INSERT INTO students (first_name, last_name, email, classroom_id) VALUES ('Πέτρος', 'Γαλάνης', 'student25@school.gr', 5);
INSERT INTO students (first_name, last_name, email, classroom_id) VALUES ('Αγγελική', 'Σταύρου', 'student26@school.gr', 5);
INSERT INTO students (first_name, last_name, email, classroom_id) VALUES ('Σπύρος', 'Διαμαντής', 'student27@school.gr', 5);
INSERT INTO students (first_name, last_name, email, classroom_id) VALUES ('Μαρίνα', 'Αλεξίου', 'student28@school.gr', 5);
INSERT INTO students (first_name, last_name, email, classroom_id) VALUES ('Λουκάς', 'Μάνος', 'student29@school.gr', 5);
INSERT INTO students (first_name, last_name, email, classroom_id) VALUES ('Ζωή', 'Κοσμίδου', 'student30@school.gr', 5);
INSERT INTO students (first_name, last_name, email, classroom_id) VALUES ('Πέτρος', 'Γαλάνης', 'student25@school.gr', 5);
INSERT INTO students (first_name, last_name, email, classroom_id) VALUES ('Αγγελική', 'Σταύρου', 'student26@school.gr', 5);

-- Τμήμα Δ1 (classroom_id = 7)
INSERT INTO students (first_name, last_name, email, classroom_id) VALUES ('Κώστας', 'Μανώλης', 'student40@school.gr', 7);
INSERT INTO students (first_name, last_name, email, classroom_id) VALUES ('Χριστίνα', 'Αλεξίου', 'student41@school.gr', 7);

-- Τμήμα Ε1 (classroom_id = 9)
INSERT INTO students (first_name, last_name, email, classroom_id) VALUES ('Αλέξανδρος', 'Ρήγας', 'student50@school.gr', 9);
INSERT INTO students (first_name, last_name, email, classroom_id) VALUES ('Στέλλα', 'Κυριάκου', 'student51@school.gr', 9);

-- Τμήμα ΣΤ1 (classroom_id = 11)
INSERT INTO students (first_name, last_name, email, classroom_id) VALUES ('Βασίλης', 'Νικολάου', 'student60@school.gr', 11);
INSERT INTO students (first_name, last_name, email, classroom_id) VALUES ('Ιωάννα', 'Μάρκου', 'student61@school.gr', 11);

-- =========================================================
-- Δάσκαλοι Τάξεων (ΠΕ70) συνδεδεμένοι με τα τμήματα 1-5
INSERT INTO teachers (first_name, last_name, specialty, email, classroom_id) VALUES ('Ιωάννης', 'Παππάς', 'ΠΕ70 - Δάσκαλος', 'pappas@school.gr', 1);
INSERT INTO teachers (first_name, last_name, specialty, email, classroom_id) VALUES ('Ελένη', 'Σοφού', 'ΠΕ70 - Δάσκαλος', 'sofou@school.gr', 2);
INSERT INTO teachers (first_name, last_name, specialty, email, classroom_id) VALUES ('Ανδρέας', 'Νικολάου', 'ΠΕ70 - Δάσκαλος', 'nikolaou@school.gr', 3);
INSERT INTO teachers (first_name, last_name, specialty, email, classroom_id) VALUES ('Δήμητρα', 'Φωτίου', 'ΠΕ70 - Δάσκαλος', 'fotiou@school.gr', 4);
INSERT INTO teachers (first_name, last_name, specialty, email, classroom_id) VALUES ('Κωνσταντίνος', 'Μελάς', 'ΠΕ70 - Δάσκαλος', 'melas@school.gr', 5);
INSERT INTO teachers (first_name, last_name, specialty, email, classroom_id) VALUES ('Ιωάννης', 'Παππάς', 'ΠΕ70 - Δάσκαλος', 'teacher1@school.gr', 1);
INSERT INTO teachers (first_name, last_name, specialty, email, classroom_id) VALUES ('Ελένη', 'Σοφού', 'ΠΕ70 - Δάσκαλος', 'teacher2@school.gr', 2);
INSERT INTO teachers (first_name, last_name, specialty, email, classroom_id) VALUES ('Ανδρέας', 'Νικολάου', 'ΠΕ70 - Δάσκαλος', 'teacher3@school.gr', 3);
INSERT INTO teachers (first_name, last_name, specialty, email, classroom_id) VALUES ('Δήμητρα', 'Φωτίου', 'ΠΕ70 - Δάσκαλος', 'teacher4@school.gr', 4);
INSERT INTO teachers (first_name, last_name, specialty, email, classroom_id) VALUES ('Κωνσταντίνος', 'Μελάς', 'ΠΕ70 - Δάσκαλος', 'teacher5@school.gr', 5);
INSERT INTO teachers (first_name, last_name, specialty, email, classroom_id) VALUES ('Γιώργος', 'Σταματίου', 'ΠΕ70 - Δάσκαλος', 'teacher6@school.gr', 11);


-- Εκπαιδευτικοί Ειδικοτήτων (Χωρίς σταθερό τμήμα - classroom_id NULL)
INSERT INTO teachers (first_name, last_name, specialty, email, classroom_id) VALUES ('Μαρία', 'Λέκκα', 'ΠΕ06 - Αγγλικών', 'lekka@school.gr', NULL);
INSERT INTO teachers (first_name, last_name, specialty, email, classroom_id) VALUES ('Γιώργος', 'Σταμάτης', 'ΠΕ11 - Φυσική Αγωγή', 'stamatis@school.gr', NULL);
INSERT INTO teachers (first_name, last_name, specialty, email, classroom_id) VALUES ('Νίκος', 'Αλεξίου', 'ΠΕ86 - Πληροφορική', 'alexiou@school.gr', NULL);
INSERT INTO teachers (first_name, last_name, specialty, email, classroom_id) VALUES ('Σοφία', 'Παπαδάκη', 'ΠΕ79 - Μουσική', 'papadaki@school.gr', NULL);
INSERT INTO teachers (first_name, last_name, specialty, email, classroom_id) VALUES ('Άννα', 'Διαμαντή', 'ΠΕ08 - Καλλιτεχνικά', 'diamanti@school.gr', NULL);
