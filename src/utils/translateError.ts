// ============================================
// Error Translation Helper
// ============================================
// Translates common backend error messages from English to Finnish
// Uses mapping objects instead of multiple if statements

// Password error patterns and translations
const PASSWORD_ERRORS: Record<string, string> = {
    'too common': 'Salasana on liian yleinen. Käytä vahvempaa salasanaa (isot/pienet kirjaimet, numerot, erikoismerkit).',
    'too short': 'Salasana on liian lyhyt. Vähintään 8 merkkiä vaaditaan.',
    'entirely numeric': 'Salasana ei voi olla pelkkiä numeroita.',
    'too similar': 'Salasana on liian samanlainen käyttäjätietojen kanssa.',
    'must contain': 'Salasanan tulee sisältää isoja ja pieniä kirjaimia, numeroita ja erikoismerkkejä.',
};

// Authentication error patterns
const AUTH_ERRORS: Record<string, string> = {
    'invalid credentials': 'Virheelliset kirjautumistiedot',
    'incorrect': 'Virheelliset kirjautumistiedot',
    'no active account': 'Virheelliset kirjautumistiedot',
    'not found': 'Resurssia ei löytynyt',
    'permission': 'Ei käyttöoikeutta',
    'not allowed': 'Ei käyttöoikeutta',
    'already exists': 'Resurssi on jo olemassa',
};

// Field-specific translations
const FIELD_ERRORS: Record<string, string> = {
    'already exists': 'on jo käytössä',
    'taken': 'on jo käytössä',
    'invalid': 'Virheellinen arvo',
    'required': 'Pakollinen kenttä',
    'blank': 'Pakollinen kenttä',
    'empty': 'Ei voi olla tyhjä',
    'too short': 'Liian lyhyt',
    'too long': 'Liian pitkä',
    'must be': 'Virheellinen muoto',
    'greater than or equal': 'Arvon tulee olla suurempi kuin 0',
    'less than or equal': 'Arvon tulee olla pienempi kuin',
    'ensure this value': 'Virheellinen arvo',
};

// Field name translations
const FIELD_NAMES: Record<string, string> = {
    'username': 'Käyttäjätunnus',
    'email': 'Sähköposti',
    'password': 'Salasana',
    'old_password': 'Vanha salasana',
    'new_password': 'Uusi salasana',
    'start_address': 'Lähtöpaikka',
    'end_address': 'Määränpää',
    'distance_km': 'Matka',
    'date': 'Päivämäärä',
};

// Find matching error pattern in mapping object
const findErrorMatch = (text: string, errorMap: Record<string, string>): string | null => {
    const lowerText = text.toLowerCase();
    for (const [pattern, translation] of Object.entries(errorMap)) {
        if (lowerText.includes(pattern)) {
            return translation;
        }
    }
    return null;
};

// Main translation function
export const translateBackendError = (error: any): string => {
    if (!error.response?.data) {
        return 'Toiminto epäonnistui';
    }

    const data = error.response.data;

    // Handle detail field (common error format)
    if (data.detail) {
        const translation = findErrorMatch(data.detail, AUTH_ERRORS);
        return translation || data.detail;
    }

    // Handle non_field_errors (usually password validation)
    if (data.non_field_errors) {
        const errorText = data.non_field_errors[0];
        const translation = findErrorMatch(errorText, PASSWORD_ERRORS);
        return translation || errorText;
    }

    // Handle field-specific errors
    for (const [fieldKey, fieldName] of Object.entries(FIELD_NAMES)) {
        if (data[fieldKey] && Array.isArray(data[fieldKey])) {
            const errorText = data[fieldKey][0];

            // Special handling for password fields
            if (fieldKey.includes('password')) {
                const translation = findErrorMatch(errorText, PASSWORD_ERRORS);
                if (translation) return translation;
            }

            // Special handling for username/email "already exists"
            if ((fieldKey === 'username' || fieldKey === 'email') &&
                (errorText.toLowerCase().includes('already exists') || errorText.toLowerCase().includes('taken'))) {
                return `${fieldName} on jo käytössä`;
            }

            // General field error translation
            const translation = findErrorMatch(errorText, FIELD_ERRORS);
            return translation ? `${fieldName}: ${translation}` : `${fieldName}: ${errorText}`;
        }
    }

    // Fallback: return first available error
    const firstKey = Object.keys(data)[0];
    if (firstKey && data[firstKey] && Array.isArray(data[firstKey])) {
        return data[firstKey][0];
    }

    return 'Toiminto epäonnistui';
};