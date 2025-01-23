# Event Management System API

API do zarządzania wydarzeniami, biletami i użytkownikami w systemie Event Management.

## Technologie

- **Node.js** - Backend
- **Express** - Framework do obsługi routingu
- **MongoDB** - Baza danych
- **Mongoose** - ODM (Object Data Modeling) dla MongoDB

## Struktura folderów

project/  
│  
├── api/  
│  
├── controllers/ # Kontrolery do obsługi logiki aplikacji  
│  
├── models/ # Modele danych  
│  
├── routes/ # Routy API  
│  
└── middleware/ # Middleware, np. autoryzacja  
├── config/ # Pliki konfiguracyjne  
├── app.js # Główny plik aplikacji  
└── package.json # Plik konfiguracyjny npm 

## Endpoints

### 1. **User**
#### POST `/users/signup`
Tworzy nowego użytkownika.

- **Body:**
    ```json
    {
        "email": "string",
        "name": "string",
        "password": "string"
    }
    ```

- **Response:**
    ```json
    {
        "message": "Utworzono nowego użytkownika"
    }
    ```

#### POST `/users/login`
Loguje użytkownika.

- **Body:**
    ```json
    {
        "email": "string",
        "password": "string"
    }
    ```

- **Response:**
    ```json
    {
        "message": "Zalogowano pomyślnie",
        "token": "JWT_token"
    }
    ```

#### GET `/users`
Pobiera wszystkich użytkowników.

- **Response:**
    ```json
    {
        "message": "Lista wszystkich użytkowników",
        "list": [{
            "email": "string",
            "name": "string",
            "password": "string"
        }]
    }
    ```

#### GET `/users/:userId`
Pobiera informacje o użytkowniku o danym id.

- **Response:**
    ```json
    {
        "message": "Dane użytkownika ${result.name}",
        "data": [{
            "email": "string",
            "name": "string",
            "password": "string"
        }]
    }
    ```

#### GET `/users/:userId/tickets`
Pobiera wszystkie bilety użytkownika.

- **Response:**
    ```json
    {
        "message": "Lista biletów użytkownika [userName]",
        "tickets": [
            {
                "eventId": "ObjectId",
                "price": "number",
                "event": {
                    "title": "string",
                    "location": "string",
                    "date": "datetime"
                }
            }
        ]
    }
    ```

#### DELETE `/users/delete-account`
Usuwa konto użytkownika.

- **Body:**
    ```json
    {
        "email": "string",
        "password": "string",
        "confirmPassword": "string"
    }
    ```

- **Response:**
    ````json
    {
        "message": "Konto zostało usunięte"
    }
    ```

### 2. **Event**
#### POST `/events`
Tworzy nowe wydarzenie.

- **Body:**
    ```json
    {
        "title": "string",
        "location": "string",
        "date": "datetime",
        "categories": [{ "name": "string" }]
    }
    ```

- **Response:**
    ```json
    {
        "message": "Utworzono nowy Event",
        "data": {
            "title": "string",
            "location": "string",
            "date": "datetime"
        }
    }
    ```

#### GET `/events`
Pobiera wszystkie wydarzenia.

- **Response:**
    ```json
    {
        "message": "Lista wszystkich eventów:",
        "list": [
            {
                "title": "string",
                "location": "string",
                "date": "datetime",
                "categories": [{ "name": "string" }]
            }
        ]
    }
    ```

#### GET `/events/:eventId`
Pobiera szczegóły wydarzenia.

- **Response:**
    ```json
    {
        "message": "Szczegóły wydarzenia nr.[eventId]",
        "data": {
            "title": "string",
            "location": "string",
            "date": "datetime"
        }
    }
    ```

#### GET `/events/count-by-category`
Zwraca liczbę wydarzeń pogrupowanych według kategorii.
- **Response:**
    ```json
    {
        "_id": "string",
        "eventCount": "number"
    }
    ```

#### PUT `/events/:eventId`
Aktualizuje dane wydarzenia o danym eventId.

- **Body:**
    ```json
    {
        "title": "string",
        "location": "string",
        "date": "datetime",
        "categories": [{ "name": "string" }]
    }

    ```
- **Response:**
    ```json
    {
        "message": "Dane wydarzenia nr.[eventId] zostały zaktualizowane"
    }

    ```    

#### DELETE `/events/:eventId`
- **Response:**
    ```json
    {
        "message": "Wydarzenie, powiązane bilety i powiadomienia zostały usunięte"
    }
    ``` 

### 3. **Ticket**
#### GET `/tickets`
Pobiera wszystkie bilety.

- **Response:**
    ```json
    {
        "message": "Lista wszystkich biletów:",
        "list": [
            {
                "eventId": "ObjectId",
                "price": "number"
            }
        ]
    }
    ```

#### GET `/tickets/:ticketId`
Pobiera szczegóły biletu o podanym ID.

- **Response:**
    ```json
    {
        "message": "Szczegóły biletu nr. [ticketId]",
        "data": {
            "_id": "ObjectId",
            "eventId": "ObjectId",
            "price": "number"
        }
    }

    ```

#### POST `/tickets`
Tworzy nowy bilet.

- **Body:**
    ```json
    {
        "eventId": "ObjectId",
        "price": "number"
    }
    ```

- **Response:**
    ```json
    {
        "message": "Bilet został utworzony",
        "data": {
            "eventId": "ObjectId",
            "price": "number"
        }
    }
    ```

#### POST `/tickets/assign`
Przypisuje bilet do użytkowników.

- **Body:**
    ```json
    {
        "ticketId": "ObjectId",
        "userIds": ["ObjectId", "ObjectId"]
    }
    ```

- **Response:**
    ```json
    {
        "message": "Bilet został przypisany do użytkowników"
    }
    ```

#### PUT `/tickets/:ticketId`
Aktualizuje dane biletu o podanym ID.

- **Body:**
    ```json
    {
        "price": "number"
    }
    ```

- **Response:**
    ```json
    {
        "message": "Bilet został zaktualizowany"
    }
    ```

#### DELETE `/tickets/:ticketId`
Usuwa bilet.

- **Response:**
    ```json
    {
        "message": "Bilet został usunięty, a użytkownicy zostali zaktualizowani"
    }
    ```

### Middleware
- **checkAuth**: Middleware do sprawdzania, czy użytkownik jest zalogowany (sprawdza token JWT).

## Modele

### **User**

Model przechowujący dane użytkownika:

- **name**: String
- **email**: String (unikalny, wymagany)
- **password**: String (wymagany)
- **tickets**: Array of ObjectIds (referencja do biletów)

### **Ticket**

Model przechowujący dane biletu:

- **eventId**: ObjectId (referencja do wydarzenia)
- **price**: Number

### **Event**

Model przechowujący dane wydarzenia:

- **title**: String
- **location**: String
- **date**: Date
- **categories**: Array of objects containing `name` 

## Przykład użycia

1. **Rejestracja użytkownika**
   - Wyślij POST na `/api/users/signup` z danymi użytkownika.
   - Wyślij POST na `/api/users/login` z danymi logowania.
   - Otrzymasz odpowiedź z tokenem JWT, który będzie używany do autoryzacji.

2. **Tworzenie biletu**
   - Wyślij POST na `/api/tickets` z danymi biletu. 
   - Otrzymasz odpowiedź z informacjami o stworzonym bilecie.

3. **Przypisanie biletu do użytkownika**
   - Możesz użyć `/api/tickets/:ticketId/assign`, aby przypisać bilet do kilku użytkowników.

4. **Pobieranie biletów użytkownika**
   - Wyślij GET na `/api/users/:userId/tickets` w celu pobrania biletów przypisanych do użytkownika.

## Uruchomienie projektu

1. Zainstaluj zależności:

```
npm install
```
2. Uruchom aplikację:
```
npm start
```
Aplikacja powinna działać na http://localhost:3000

## Podsumowanie

To API umożliwia pełną obsługę systemu zarządzania wydarzeniami, w tym tworzenie wydarzeń i biletów. Oferuje także pełną obsługę użytkowników, w tym rejestrację, logowanie i przypisanie biletów.
