/*
 *La classe Connexion est utilisée par le site pour
 * obtenir le nom et le token de l'utilisateur à partir de son code permanent
 */
class Connexion {
    //Variables de la classe
    endpointLogin;
    code;
    token;
    name;

    // Constructeur de la classe
    constructor() {
        this.endpointLogin = 'http://adresse-serveur.fr:8080/login';
        //On peut changer d'utilisateur en rempaçant le code permanent ici
        const donneesLogin = { code: 'CODE_PERMANENT_ETUDIANT' };

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://adresse-serveur.fr',
            },
            body: JSON.stringify(donneesLogin),
        };

        fetch(this.endpointLogin, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erreur HTTP: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {

                //On affecte les valeurs retournées par le serveur aux variables de l'objet Connexion créé
                this.code = data.Code;
                this.token = data.Token;
                this.name = data.Name;
            })
            .catch(error => {

            });


    }
}
