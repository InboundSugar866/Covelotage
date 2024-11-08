import toast from "react-hot-toast";
import { authenticate } from "./userHelper";

/** validate login page username */
export async function usernameValidate(values) {

    const errors = usernameVerify({}, values);
    if (values.username) {
        // check user existance
        const { status } = await authenticate(values.username);
        // 200 <=> the request was successful
        if (status !== 200) {
            errors.exist = toast.error("L'utilisateur n'a pas été trouvé, vérifiez le nom d'utilisateur");
        }
    }
    return errors;
}

/** validate password page */
export async function passwordValidate(values) {

    const errors = passwordVerify({}, values);
    return errors;
}

/** validate reset form */
export async function resetPasswordValidate(values) {
    
    const errors = resetPasswordVerify({}, values);
    return errors;
}

/** validate register page */
export async function registerValidate(values) {

    const errors = usernameVerify({}, values);
    passwordVerify(errors, values);
    emailVerify(errors, values);
    return errors;
}

/** validate profile page */
export async function profileValidate(values) {

    const errors = emailVerify({}, values);
    return errors;
}


/** ************************************************************************************** */

/** Validate reset password */
function resetPasswordVerify(errors = {}, values) {

    if(values.password !== values.confirm_pwd){
        errors.password = toast.error("Mauvais mot de passe...!");
    }
    // if (passwordVerify({}, values).password) {
    //     errors.password = passwordVerify({}, values).password;
    // }

    return errors;
}

/** Verify password */
function passwordVerify(errors = {}, values) {

    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    if(!values.password){
        errors.password = toast.error('Mot de passe reqis...!');
    }
    else if(values.password.includes(" ")) {
        errors.password = toast.error('Mauvais mot de passe...!');
    } 
    else if(values.password.length < 8 ) {
        errors.password = toast.error('Le mot de passe doit faire au moins 8 caractères');
    } 
    else if(!specialChars.test(values.password) ) {
        errors.password = toast.error('Le mot de passe doit contenir un caractère spécial');
    }
    return errors;
}

/** Verify username */
function usernameVerify(errors = {}, values) {

    if(!values.username){
        errors.username = toast.error("Nom d'utilisateur requis...!");
    } 
    else if(values.username.includes(" ")) {
        errors.username = toast.error("Nom d'utilisateur inconnu...!");
    }
    return errors;
}

/** Verify email */
function emailVerify(errors = {}, values) {

    if(!values.email){
        errors.email = toast.error('Email requis...!');
    } 
    else if(values.email.includes(" ")) {
        errors.email = toast.error('Email non reconnu...!');
    }
    else if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = toast.error('Email invalide...!');
    }
    return errors;
}
