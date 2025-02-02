const ADMIN_PASSWORD = 'hawkeye';

function validateAdminPassword(password) {
    return password === ADMIN_PASSWORD;
}

function saveAuthToSession(role) {
    try {
        sessionStorage.setItem('userRole', role);
    } catch (error) {
        reportError(error);
    }
}

function getAuthFromSession() {
    try {
        return sessionStorage.getItem('userRole');
    } catch (error) {
        reportError(error);
        return null;
    }
}

function clearAuthFromSession() {
    try {
        sessionStorage.removeItem('userRole');
    } catch (error) {
        reportError(error);
    }
}
