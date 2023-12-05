const tf = require('@tensorflow/tfjs-node');
const { RandomForestClassifier } = require('ml-randomforest');

// Function to train the classifier
async function trainClassifier() {
  // Load CSV data
  const df = await tf.data.csv('../assets/Dataset for Extrafeature.csv'); 

  // Encode categorical variables
  const encoder = new OneHotEncoder();
  const X = encoder.fit_transform(df[['Priority', 'Type']]);

  // Assign labels
  const y = df['Agent'];

  // Train a RandomForestClassifier
  const classifier = new RandomForestClassifier({ n_jobs: -1 });
  classifier.fit(X, y);

  return { classifier, encoder };
}

// Function to get assignment probabilities
function getAssignmentProbabilities(Type, Priority, classifier, encoder) {
  // Encode new ticket
  const newTicketEncoded = encoder.transform([{ Priority, Type }]);

  // Predict probabilities for each agent
  const probabilities = classifier.predictProba(newTicketEncoded);

  // Create an object to store the results
  const results = {};

  // Populate the object with agent probabilities
  for (let i = 0; i < classifier.classes_.length; i++) {
    const agent = classifier.classes_[i];
    results[agent] = probabilities[0][i];
  }

  return results;
}

// Example usage:
trainClassifier()
  .then(({ classifier, encoder }) => {
    const probabilities = getAssignmentProbabilities('Type_value', 'Priority_value', classifier, encoder);
    console.log(probabilities);
  })
  .catch(error => {
    console.error(error);
  });
