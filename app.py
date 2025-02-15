from flask import Flask, render_template, request, redirect, url_for, flash, session
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
import sqlite3

app = Flask(_name_)
app.secret_key = 'your_secret_key'
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'  # Redirect to login page if accessing a protected route

def init_db():
    with sqlite3.connect("weather_app.db") as conn:
        cursor = conn.cursor()
        cursor.execute("""CREATE TABLE IF NOT EXISTS users (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            email TEXT UNIQUE NOT NULL,
                            password TEXT NOT NULL)""")
        cursor.execute("""CREATE TABLE IF NOT EXISTS saved_cities (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            user_id INTEGER NOT NULL,
                            city TEXT NOT NULL,
                            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE)""")
        conn.commit()


init_db()

# User class
class User(UserMixin):
    def _init_(self, id, email):
        self.id = id
        self.email = email

# Load user function required by flask_login
@login_manager.user_loader
def load_user(user_id):
    with sqlite3.connect("weather_app.db") as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
        user = cursor.fetchone()
        if user:
            return User(id=user[0], email=user[1])
    return None

# Home page route
@app.route('/')
def home():
    return render_template('home.html')

# Registration route
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        
        with sqlite3.connect("weather_app.db") as conn:
            cursor = conn.cursor()
            try:
                cursor.execute("INSERT INTO users (email, password) VALUES (?, ?)", (email, hashed_password))
                conn.commit()
                flash("Registration successful! Please log in.", "success")
                return redirect(url_for('login'))
            except sqlite3.IntegrityError:
                flash("Email already exists. Please try another.", "danger")
    
    return render_template('register.html')

# Login route
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        
        with sqlite3.connect("weather_app.db") as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
            user = cursor.fetchone()
            
            if user and bcrypt.check_password_hash(user[2], password):
                login_user(User(id=user[0], email=user[1]))
                flash("Login successful!", "success")
                return redirect(url_for('weather'))
            else:
                flash("Invalid credentials. Please try again.", "danger")
                
    return render_template('login.html')
@app.route('/save_city', methods=['POST'])
@login_required
def save_city():
    city = request.json.get("city")
    user_id = current_user.id
    if city:
        with sqlite3.connect("weather_app.db") as conn:
            cursor = conn.cursor()
            cursor.execute("INSERT INTO saved_cities (user_id, city) VALUES (?, ?)", (user_id, city))
            conn.commit()
    return {"message": "City saved successfully"}, 200

@app.route('/get_saved_cities')
@login_required
def get_saved_cities():
    user_id = current_user.id
    with sqlite3.connect("weather_app.db") as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT city FROM saved_cities WHERE user_id = ?", (user_id,))
        cities = [row[0] for row in cursor.fetchall()]
    return {"savedCities": cities}, 200


# Weather page route (protected)
@app.route('/weather')
@login_required
def weather():
    return render_template('weather.html')

# Logout route
@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash("Logged out successfully.", "success")
    return redirect(url_for('home'))

if _name_ == '_main_':
    app.run(debug=True)