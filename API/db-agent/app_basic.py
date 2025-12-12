
import sqlite3
from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# Initialize database
def init_db():
    os.makedirs('data', exist_ok=True)
    conn = sqlite3.connect('data/data.db')
    c = conn.cursor()
    c.execute("""CREATE TABLE IF NOT EXISTS doctor_info (
                doc_id INTEGER PRIMARY KEY AUTOINCREMENT,
                specialist TEXT NOT NULL,
                cures_disease TEXT NOT NULL,
                location TEXT NOT NULL,
                phone TEXT NOT NULL,
                email TEXT NOT NULL);""")
    
    c.execute("""CREATE TABLE IF NOT EXISTS medicine_info (
                m_id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                for_disease TEXT NOT NULL,
                price INTEGER NOT NULL);""")

    conn.commit()
    conn.close()

init_db()

# Create a single global connection for demo (not ideal for big apps)
conn = sqlite3.connect('data/data.db', check_same_thread=False)
c = conn.cursor()

#//////////////////////// used for admin panel/////////////////////////
# Get section
@app.route('/getAllDocInfo', methods=['GET'])
def get_all_docInfo():
    c.execute('SELECT * FROM doctor_info;')
    records = c.fetchall()
    if records:
        return jsonify(records)
    else:
        return jsonify({'message': 'No user found'})
    
@app.route('/getAllMedInfo', methods=['GET'])
def get_all_medInfo():
    c.execute('SELECT * FROM medicine_info;')
    records = c.fetchall()
    if records:
        return jsonify(records)
    else:
        return jsonify({'message': 'No user found'})

# post section
@app.route('/setDocInfo', methods=['POST'])
def set_docInfo():
    specialist = request.args.get('specialist', type=str)
    cures_disease = request.args.get('cures_disease', type=str)
    location = request.args.get('location', type=str)
    phone = request.args.get('phone', type=str)
    email = request.args.get('email', type=str)

    query = "INSERT INTO doctor_info (specialist, cures_disease, location, phone, email) VALUES (?, ?, ?, ?, ?)"
    c.execute(query, (specialist, cures_disease, location, phone, email))
    conn.commit()

    # return jsonify({
    #     'organizer': organizer,
    #     'location': location,
    #     'date': date,
    #     'time': time
    # })

@app.route('/setMedInfo', methods=['POST'])
def set_health_volunteer():
    name = request.args.get('name', type=str)
    for_disease = request.args.get('for_disease', type=str)
    price = request.args.get('price', type=str)

    query = "INSERT INTO medicine_info (name, for_disease, price) VALUES (?, ?, ?)"
    c.execute(query, (name, for_disease, price))
    conn.commit()

    # return jsonify({
    #     'name': name,
    #     'service': service,
    #     'contact': contact
    # })

@app.route('/deleteDocInfo', methods=['POST'])
def del_health_events():
    doc_id = request.args.get('doc_id', type=int)
    c.execute("DELETE FROM doctor_info WHERE doc_id = ?", (doc_id))
    conn.commit()
    return jsonify({'message': f'Doctor {doc_id} deleted successfully'})

@app.route('/deleteMedInfo', methods=['POST'])
def del_health_worker_volunteer():
    m_id = request.args.get('v_id', type=int)
    c.execute("DELETE FROM medicine_info WHERE m_id = ?", (m_id,))
    conn.commit()
    return jsonify({'message': f'User {m_id} deleted successfully'})

#////////////////////////////////////////////////////////////////////////////


# ///////////////////////////// used for user ///////////////////////////////////
# get section of doc info by cure_disease
@app.route('getDocInfo', methods=['GET'])
def get_docInfo():
    d = request.args.get('d', type=str)
    c.execute('SELECT * FROM doctor_info where cures_disease=?', [d])
    l_docInfo = c.fetchall()
    if l_docInfo:
        return jsonify(l_docInfo)
    else:
        return jsonify({'message':'No doctor found'})

# get section of med info by for_disease
@app.route('getDocInfo', methods=['GET'])
def get_docInfo():
    d = request.args.get('d', type=str)
    c.execute('SELECT * FROM medicine_info where for_disease=?', [d])
    l_medInfo = c.fetchall()
    if l_docInfo:
        return jsonify(l_medInfo)
    else:
        return jsonify({'message':'No doctor found'})
#///////////////////////////////////////////////////////////////////////////////

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=False, port=5666)
