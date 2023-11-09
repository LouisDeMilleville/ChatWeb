/*
 *La classe LoadMessages permet au site de récupérer
 * les 50 derniers messages auprès du serveur, puis
 * de les stocker au format JSON dans sa variable liste pour
 * que le script principal puisse les afficher dans l'emplacement
 * prévu à cet effet
 */
class LoadMessages{
    //Variables de la classe
    endpointMessages;
    liste;
    //Constructeur de la classe
    constructor(token) {
        this.endpointMessages = 'http://adresse-serveur.fr:8080/messages';
        const requestOptions = {
            method: 'OPTIONS',
            headers: {
                'Authorization': `Basic ` + token,
                'Access-Control-Allow-Origin': 'http://adresse-serveur.fr',
            },
        };

        fetch(this.endpointMessages, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erreur HTTP: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                //On stocke la liste des messages reçus dans la variable liste de l'objet créé
                this.liste = data;
            })
            .catch(error => {

            });
    }
}