import pickle
import sys
import os

# Load the classifier and vectorizer
model_path = os.path.join(os.path.dirname(__file__), "classifier.pkl")
with open(model_path, "rb") as f:
    classifier, vectorizer = pickle.load(f)

# Get email content from command-line arguments
email_content = sys.argv[1]

# Predict
X = vectorizer.transform([email_content])
label = classifier.predict(X)[0]
print(label)
