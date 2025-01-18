from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

# Define the scopes for accessing Gmail
SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']

def authenticate_gmail():
    """Authenticate the user and save credentials."""
    creds = None
    # Authenticate user and save token
    flow = InstalledAppFlow.from_client_secrets_file(
        'credentials.json', SCOPES)
    creds = flow.run_local_server(port=0)
    
    # Save the token for future use
    with open('token.json', 'w') as token_file:
        token_file.write(creds.to_json())
    return creds

def list_emails():
    """Fetch and print email snippets."""
    creds = Credentials.from_authorized_user_file('token.json', SCOPES)
    service = build('gmail', 'v1', credentials=creds)
    
    # List the latest 10 emails
    results = service.users().messages().list(userId='me', maxResults=10).execute()
    messages = results.get('messages', [])
    
    if not messages:
        print("No messages found.")
    else:
        for message in messages:
            msg_data = service.users().messages().get(userId='me', id=message['id']).execute()
            print(f"Snippet: {msg_data['snippet']}\n")

if __name__ == '__main__':
    # Authenticate the first time
    authenticate_gmail()
    # List emails
    list_emails()
