import React from 'react';

export const CertificateTemplate = React.forwardRef(({ student }, ref) => {
    const today = new Date().toLocaleDateString('el-GR');

    return (
        <div ref={ref} style={{ padding: '80px', fontFamily: 'serif', color: '#000' }}>
            <div style={{ textAlign: 'center', borderBottom: '2px solid #000', marginBottom: '30px' }}>
                <h2>ΕΛΛΗΝΙΚΗ ΔΗΜΟΚΡΑΤΙΑ</h2>
                <h3>ΥΠΟΥΡΓΕΙΟ ΠΑΙΔΕΙΑΣ & ΘΡΗΣΚΕΥΜΑΤΩΝ</h3>
                <h4>3ο ΔΗΜΟΤΙΚΟ ΣΧΟΛΕΙΟ ΘΕΣ/ΝΙΚΗΣ</h4>
            </div>

            <div style={{ textAlign: 'right', marginBottom: '50px' }}>
                <p>Ημερομηνία: {today}</p>
            </div>

            <h2 style={{ textAlign: 'center', textDecoration: 'underline', marginBottom: '40px' }}>
                ΒΕΒΑΙΩΣΗ ΕΝΗΜΕΡΩΣΗΣ ΓΟΝΕΑ
            </h2>

            <p style={{ fontSize: '18px', lineHeight: '2', textAlign: 'justify' }}>
                Βεβαιώνεται ότι ο/η κηδεμόνας του/της μαθητή/τριας
                <strong> {student?.firstName} {student?.lastName}</strong>,
                ο/η οποίος/α φοιτά στο τμήμα <strong>{student?.classroom?.name || "---"}</strong>,
                προσήλθε σήμερα στο σχολείο και ενημερώθηκε ενδελεχώς για την σχολική επίδοση
                και τη διαγωγή του/της μαθητή/τριας από το διδακτικό προσωπικό.
            </p>

            <div style={{ marginTop: '100px', display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ textAlign: 'center' }}>
                    <p>Ο/Η Εκπαιδευτικός</p>
                    <br /><br />
                    <p>..........................</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <p>Ο Διευθυντής</p>
                    <br /><br />
                    <p>..........................</p>
                </div>
            </div>
        </div>
    );
});