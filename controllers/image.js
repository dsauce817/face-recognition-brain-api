const returnClarifaiRequestOptions = (imageUrl) => {
  // Your PAT (Personal Access Token) can be found in the portal under Authentification
  const PAT = process.env.API_CLARIFAI;
  // Specify the correct user_id/app_id pairings
  // Since you're making inferences outside your app's scope
  const USER_ID = 'saucedo817';       
  const APP_ID = 'test';
  // Change these to whatever model and image URL you want to use
  const IMAGE_URL = imageUrl;

  const raw = JSON.stringify({
      "user_app_id": {
          "user_id": USER_ID,
          "app_id": APP_ID
      },
      "inputs": [
          {
              "data": {
                  "image": {
                      "url": IMAGE_URL
                  }
              }
          }
      ]
  });  
  
  const requestOptions = {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Authorization': 'Key ' + PAT
      },
      body: raw
  };    
  return requestOptions;  
}

const handleApiCall = (req, res, fetch) => {
	fetch("https://api.clarifai.com/v2/models/" + 'face-detection'  + "/outputs", returnClarifaiRequestOptions(req.body.input))
	    .then((response) => response.text())
	    .then((result) => {
	      res.json(result);
	    })
	    .catch(err => res.status(400).json('unable to work with API'))
}

const handleImage = (req, res, db) => {
	const {id} = req.body;
	db('users').where('id', '=', id)
	.increment('entries', 1)
	.returning('entries')
	.then(entries => {
	    // If you are using knex.js version 1.0.0 or higher this now returns an array of objects. Therefore, the code goes from:
	    // entries[0] --> this used to return the entries
	    // TO
	    // entries[0].entries --> this now returns the entries
	    res.json(entries[0].entries);
	})
	.catch(err => res.status(400).json('unable to get entries'))
}


export default {handleImage,handleApiCall}