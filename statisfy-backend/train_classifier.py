from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
import pickle

# Sample dataset
emails = [
    "We are hiring for a software engineer role.",
    "Your package has been delivered.",
    "Looking for a talented data scientist.",
    "Reminder: Your doctor's appointment is tomorrow.",
    "Join us as a full-stack developer.",
    "Your monthly bank statement is ready.",
]
labels = ["job-related", "not-job-related", "job-related", "not-job-related", "job-related", "not-job-related"]

# Train the classifier
vectorizer = CountVectorizer()
X = vectorizer.fit_transform(emails)
classifier = MultinomialNB()
classifier.fit(X, labels)

# Save the classifier and vectorizer
with open("classifier.pkl", "wb") as f:
    pickle.dump((classifier, vectorizer), f, protocol=pickle.HIGHEST_PROTOCOL)

print("Classifier trained and saved to classifier.pkl")
