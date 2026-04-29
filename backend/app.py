from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)  


DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': 'root123',   
    'database': 'jp_software_db'
}

def get_db():
    """Get a database connection."""
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        return conn
    except Error as e:
        print(f"DB Connection Error: {e}")
        return None


def init_db():
    """Create database and tables if they don't exist."""
    try:
        
        conn = mysql.connector.connect(
            host=DB_CONFIG['host'],
            user=DB_CONFIG['user'],
            password=DB_CONFIG['password']
        )
        cursor = conn.cursor()
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DB_CONFIG['database']}")
        cursor.execute(f"USE {DB_CONFIG['database']}")

        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS internship_applications (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(150) NOT NULL,
                phone VARCHAR(20),
                track VARCHAR(50),
                college VARCHAR(200),
                message TEXT,
                status ENUM('pending','reviewed','accepted','rejected') DEFAULT 'pending',
                applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """)

        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS contact_messages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(150) NOT NULL,
                subject VARCHAR(200),
                message TEXT,
                is_read TINYINT(1) DEFAULT 0,
                received_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """)

        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS admin_users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password VARCHAR(100) NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """)

        
        cursor.execute("SELECT * FROM admin_users WHERE username = 'admin'")
        if not cursor.fetchone():
            cursor.execute(
                "INSERT INTO admin_users (username, password) VALUES (%s, %s)",
                ('admin', 'admin123')   # Change in production!
            )

        conn.commit()
        cursor.close()
        conn.close()
        print("✅ Database initialized successfully.")
    except Error as e:
        print(f"❌ Database init error: {e}")



@app.route('/')
def index():
    return jsonify({'message': 'JP Software Solution API is running!', 'status': 'ok'})


@app.route('/api/apply', methods=['POST'])
def apply_internship():
    data = request.get_json()
    required = ['name', 'email', 'phone', 'track', 'college']
    for field in required:
        if not data.get(field):
            return jsonify({'success': False, 'message': f'{field} is required'}), 400

    conn = get_db()
    if not conn:
        return jsonify({'success': False, 'message': 'Database connection failed'}), 500

    try:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO internship_applications (name, email, phone, track, college, message)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (data['name'], data['email'], data['phone'], data['track'], data['college'], data.get('message', '')))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'success': True, 'message': 'Application submitted successfully!'})
    except Error as e:
        return jsonify({'success': False, 'message': str(e)}), 500


@app.route('/api/contact', methods=['POST'])
def contact():
    data = request.get_json()
    required = ['name', 'email', 'subject', 'message']
    for field in required:
        if not data.get(field):
            return jsonify({'success': False, 'message': f'{field} is required'}), 400

    conn = get_db()
    if not conn:
        return jsonify({'success': False, 'message': 'Database connection failed'}), 500

    try:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO contact_messages (name, email, subject, message)
            VALUES (%s, %s, %s, %s)
        """, (data['name'], data['email'], data['subject'], data['message']))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'success': True, 'message': 'Message sent successfully!'})
    except Error as e:
        return jsonify({'success': False, 'message': str(e)}), 500



@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    conn = get_db()
    if not conn:
        return jsonify({'success': False, 'message': 'DB error'}), 500
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM admin_users WHERE username=%s AND password=%s",
                   (data.get('username'), data.get('password')))
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    if user:
        return jsonify({'success': True, 'message': 'Login successful'})
    return jsonify({'success': False, 'message': 'Invalid credentials'}), 401

@app.route('/api/admin/applications', methods=['GET'])
def get_applications():
    conn = get_db()
    if not conn:
        return jsonify({'success': False}), 500
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM internship_applications ORDER BY applied_at DESC")
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    for row in rows:
        if row.get('applied_at'):
            row['applied_at'] = row['applied_at'].strftime('%Y-%m-%d %H:%M:%S')
    return jsonify({'success': True, 'data': rows})

@app.route('/api/admin/applications/<int:app_id>/status', methods=['PUT'])
def update_app_status(app_id):
    data = request.get_json()
    conn = get_db()
    if not conn:
        return jsonify({'success': False}), 500
    cursor = conn.cursor()
    cursor.execute("UPDATE internship_applications SET status=%s WHERE id=%s",
                   (data.get('status'), app_id))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'success': True})

@app.route('/api/admin/applications/<int:app_id>', methods=['DELETE'])
def delete_application(app_id):
    conn = get_db()
    if not conn:
        return jsonify({'success': False}), 500
    cursor = conn.cursor()
    cursor.execute("DELETE FROM internship_applications WHERE id=%s", (app_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'success': True})

@app.route('/api/admin/messages', methods=['GET'])
def get_messages():
    conn = get_db()
    if not conn:
        return jsonify({'success': False}), 500
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM contact_messages ORDER BY received_at DESC")
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    for row in rows:
        if row.get('received_at'):
            row['received_at'] = row['received_at'].strftime('%Y-%m-%d %H:%M:%S')
    return jsonify({'success': True, 'data': rows})

@app.route('/api/admin/messages/<int:msg_id>/read', methods=['PUT'])
def mark_read(msg_id):
    conn = get_db()
    if not conn:
        return jsonify({'success': False}), 500
    cursor = conn.cursor()
    cursor.execute("UPDATE contact_messages SET is_read=1 WHERE id=%s", (msg_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'success': True})

@app.route('/api/admin/messages/<int:msg_id>', methods=['DELETE'])
def delete_message(msg_id):
    conn = get_db()
    if not conn:
        return jsonify({'success': False}), 500
    cursor = conn.cursor()
    cursor.execute("DELETE FROM contact_messages WHERE id=%s", (msg_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'success': True})

@app.route('/api/admin/stats', methods=['GET'])
def get_stats():
    conn = get_db()
    if not conn:
        return jsonify({'success': False}), 500
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT COUNT(*) as total FROM internship_applications")
    total_apps = cursor.fetchone()['total']
    cursor.execute("SELECT COUNT(*) as total FROM internship_applications WHERE status='pending'")
    pending = cursor.fetchone()['total']
    cursor.execute("SELECT COUNT(*) as total FROM contact_messages")
    total_msgs = cursor.fetchone()['total']
    cursor.execute("SELECT COUNT(*) as total FROM contact_messages WHERE is_read=0")
    unread = cursor.fetchone()['total']
    cursor.close()
    conn.close()
    return jsonify({'success': True, 'data': {
        'total_applications': total_apps,
        'pending_applications': pending,
        'total_messages': total_msgs,
        'unread_messages': unread
    }})


if __name__ == '__main__':
    init_db()
    app.run(debug=True, host='0.0.0.0', port=5000)
