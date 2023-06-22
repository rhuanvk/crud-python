import psycopg2 as pypg
import flask_cors
from flask import Flask


cors = flask_cors.CORS()
app = Flask(__name__)
cors.init_app(app)


class Connection:
    
    def __init__(self):
        self.conn = pypg.connect(
            database = 'rhuan_teste',
            host = '192.168.0.202',
            port = '5432',
            user = 'postgres',
            password = 'fb789'
        )
    
    def connect(self):
        return self.conn
    
    def disconnect(self):
        return self.conn.close()


db_connect = Connection()

@app.route('/getCadPessoas', methods=['get'])
def show_cad_pessoas():
    cursor = db_connect.connect().cursor()
    cursor.execute('select * from cad_pessoas')
    columns = [column[0] for column in cursor.description]
    rows = cursor.fetchall()
    result = []
    for row in rows:
        result.append(dict(zip(columns, row)))
    
    cursor.close()
    return result


if __name__ == '__main__':
    app.run("0.0.0.0", port=5000, debug=True, threaded=True)