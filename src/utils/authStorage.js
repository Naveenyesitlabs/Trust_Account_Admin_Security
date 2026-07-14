const AUTH_STORAGE_KEY = "trust-admin";
const REMEMBERED_EMAIL_KEY = "trust-admin-email";

const parseStoredValue = (value) => {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export const getStoredSession = () =>
  parseStoredValue(localStorage.getItem(AUTH_STORAGE_KEY));

export const hasAuthSession = () => Boolean(getStoredSession()?.role);

export const storeAuthSession = (authData) => {
  const safeUser = authData?.userData
    ? {
        userid: authData.userData.userid,
        name: authData.userData.name,
        email: authData.userData.email,
        role: authData.userData.role,
        role_id: authData.userData.role_id,
        stripe_customer_id: authData.userData.stripe_customer_id ?? null,
        super_admin_selected_plan:
          authData.userData.super_admin_selected_plan ?? null,
      }
    : null;

  const payload = JSON.stringify({
    subscription: authData?.subscription ?? {},
    role: authData?.role,
    user: safeUser,
  });

  localStorage.setItem(AUTH_STORAGE_KEY, payload);
};

export const clearAuthSession = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

export const getRememberedEmail = () =>
  localStorage.getItem(REMEMBERED_EMAIL_KEY) || "";

export const storeRememberedEmail = (email) => {
  localStorage.setItem(REMEMBERED_EMAIL_KEY, email);
};

export const clearRememberedEmail = () => {
  localStorage.removeItem(REMEMBERED_EMAIL_KEY);
};
