import json
import psycopg2 as pypg
import requests

import flask
from flask import Flask
from flask_cors import CORS

from decimal import Decimal


app = Flask(__name__)
cors = CORS(app)


class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return str(obj)
        return json.JSONEncoder.default(self, obj)


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

# retorno de reposta para a consulta de CNPJ
@app.route('/consultaCNPJ', methods=['GET'])
def get_consulta_cnpj():
    request = flask.request.args
    consulta_cnpj = requests.get('https://receitaws.com.br/v1/cnpj/' + request['cnpj'])
    
    return consulta_cnpj.text
    

# retorno de resposta para o módulo de cadastro de pessoas
@app.route('/newCadPessoa', methods=['POST'])
def new_cad_pessoa():
    request = flask.request.get_json(force=True)
    cursor = db_connect.connect().cursor()
    cursor.execute('rollback')
    cursor.execute("""
                    INSERT INTO 
                        cad_pessoas(
                            nome, 
                            cpf_cnpj, 
                            rg_ie, 
                            email, 
                            telefone_1, 
                            telefone_2) 
                        VALUES(
                            %(nome)s, 
                            %(cpf_cnpj)s, 
                            %(rg_ie)s, 
                            %(email)s, 
                            %(telefone1)s, 
                            %(telefone2)s
                )""", request)
    cursor.connection.commit()
    cursor.close()
    
    return {}, 200



@app.route('/altCadPessoa', methods=['PUT'])
def alt_cad_pessoa():
    request = flask.request.get_json(force=True)
    cursor = db_connect.connect().cursor()
    cursor.execute('rollback')
    cursor.execute("""
                    UPDATE 
                        cad_pessoas 
                    SET 
                        nome = %(nome)s, 
                        cpf_cnpj = %(cpf_cnpj)s, 
                        rg_ie = %(rg_ie)s, 
                        email = %(email)s, 
                        telefone_1 = %(telefone1)s, 
                        telefone_2 = %(telefone2)s 
                    WHERE 
                        codigo = %(codigo)s
                """, request)
    cursor.connection.commit()
    cursor.close()
        
    return {}, 200
        


@app.route('/delCadPessoa', methods=['DELETE'])
def del_cad_pessoa():
    request = flask.request.get_json(force=True)
    cursor = db_connect.connect().cursor()
    cursor.execute('rollback')
    cursor.execute("DELETE FROM cad_pessoas WHERE codigo = %(codigo)s", request)
    cursor.connection.commit()
    cursor.close()
    
    return {}, 200
        

 
@app.route('/getCadPessoas', methods=['GET'])
def show_cad_pessoas():
    request = flask.request.args
    filtros = {}
    for arg in request.keys():
        if request[arg] != '':
            filtros.update({arg: '%' + request[arg] + '%'})
        else:
            filtros.update({arg: ''})
    
    cursor = db_connect.connect().cursor()
    cursor.execute('rollback')
    cursor.execute("""
                    SELECT 
                        codigo, 
                        nome, 
                        cpf_cnpj, 
                        rg_ie, 
                        email, 
                        telefone_1, 
                        telefone_2 
                    FROM cad_pessoas
                    WHERE                        
                        CASE
                            WHEN %(nome)s <> '' 
                            THEN nome like %(nome)s
                            ELSE TRUE
                        END 
                    AND 
                        CASE
                            WHEN %(cpf_cnpj)s <> '' 
                            THEN cpf_cnpj like %(cpf_cnpj)s
                            ELSE TRUE
                        END 
                    AND 
                        CASE
                            WHEN %(rg_ie)s <> '' 
                            THEN rg_ie like %(rg_ie)s
                            ELSE TRUE
                        END 
                    AND
                        CASE
                            WHEN %(email)s <> '' 
                            THEN email like %(email)s
                            ELSE TRUE
                        END 
                    AND
                        CASE
                            WHEN %(telefone)s <> '' 
                            THEN telefone_1 like %(telefone)s
                            ELSE TRUE
                        END
                    ORDER BY codigo
                """, filtros)
    columns = [column[0] for column in cursor.description]
    rows = cursor.fetchall()
    result = []
    for row in rows:
        result.append(dict((zip(columns, row))))
    
    cursor.close()
    return json.dumps(result)



# retorno de resposta para o módulo de receitas
@app.route('/newFinParcela', methods=['POST'])
def new_fin_parcela():
    request = flask.request.get_json(force=True)
    cursor = db_connect.connect().cursor()
    cursor.execute('rollback')
    cursor.execute("""
                    INSERT INTO 
                        fin_receitas(
                            valor, 
                            pessoa_ref, 
                            forma_pgto, 
                            quitada) 
                        VALUES(
                            %(valor)s, 
                            %(pessoa)s, 
                            %(forma_pgto)s, 
                            %(quitada)s
                )""", request)
    cursor.connection.commit()
    cursor.close()
    
    return {}, 200



@app.route('/altFinParcela', methods=['PUT'])
def alt_fin_parcela():
    request = flask.request.get_json(force=True)
    cursor = db_connect.connect().cursor()
    cursor.execute('rollback')
    cursor.execute("""
                    UPDATE 
                        fin_receitas 
                    SET 
                        valor = %(valor)s, 
                        pessoa_ref = %(pessoa)s, 
                        forma_pgto = %(forma_pgto)s, 
                        quitada = %(quitada)s 
                    WHERE 
                        codigo = %(codigo)s
                """, request)
    cursor.connection.commit()
    cursor.close()
        
    return {}, 200



@app.route('/delFinParcela', methods=['DELETE'])
def del_fin_parcela():
    request = flask.request.get_json(force=True)
    cursor = db_connect.connect().cursor()
    cursor.execute('rollback')
    cursor.execute("DELETE FROM fin_receitas WHERE codigo = %(codigo)s", request)
    cursor.connection.commit()
    cursor.close()
    
    return {}, 200



@app.route('/getContasReceber', methods=['GET'])
def show_contas_receber():
    request = flask.request.args
    filtros = {}
    for arg in request.keys():
        if arg.__contains__('valor') == False:
            if request[arg] != '':
                filtros.update({arg: '%' + request[arg] + '%'})
            else:
                filtros.update({arg: ''})
        else:
            if request[arg] != '':
                filtros.update({arg: request[arg]})

    cursor = db_connect.connect().cursor()
    cursor.execute('rollback')
    cursor.execute("""
                    SELECT 
                        fr.codigo, 
                        fr.pessoa_ref, 
                        cp.nome AS pessoa, 
                        fr.valor, 
                        fr.forma_pgto, 
                        CASE 
                            WHEN fr.quitada = true THEN 'sim' 
                            WHEN fr.quitada = false THEN 'não' 
                        END as quitada 
                    FROM fin_receitas fr 
                    LEFT JOIN cad_pessoas cp ON cp.codigo = fr.pessoa_ref 
                    WHERE
                        CASE
                            WHEN %(nome)s <> '' 
                            THEN cp.nome like %(nome)s
                            ELSE TRUE
                        END 
                    AND 
                        CASE
                            WHEN %(forma_pgto)s <> '' 
                            THEN fr.forma_pgto like %(forma_pgto)s
                            ELSE TRUE
                        END 
                    AND
                        fr.valor BETWEEN
                            CASE
                                WHEN %(valor_minimo)s <> ''
                                THEN %(valor_minimo)s
                                ELSE 0
                            END 
                        AND
                            CASE
                                WHEN %(valor_maximo)s <> ''
                                THEN %(valor_maximo)s
                                ELSE 99999999.99
                            END 
                    AND
                        CASE
                            WHEN %(quitada)s <> '' 
                            THEN fr.quitada::varchar like %(quitada)s
                            ELSE TRUE
                        END
                    ORDER BY codigo
                """, filtros)
    columns = [column[0] for column in cursor.description]    
    rows = cursor.fetchall()
    result = []
    for row in rows:
        result.append(dict((zip(columns, row))))

    cursor.close()
    return json.dumps(result, cls=DecimalEncoder)
    


# retorno de resposta para o módulo de despesas
@app.route('/newFinDespesa', methods=['POST'])
def new_fin_despesa():
    request = flask.request.get_json(force=True)
    cursor = db_connect.connect().cursor()
    cursor.execute('rollback')
    cursor.execute("""
                    INSERT INTO 
                        fin_despesas(
                            valor, 
                            pessoa_ref, 
                            forma_pgto, 
                            quitada) 
                        VALUES(
                            %(valor)s, 
                            %(pessoa)s, 
                            %(forma_pgto)s, 
                            %(quitada)s
                )""", request)
    cursor.connection.commit()
    cursor.close()
    
    return {}, 200



@app.route('/altFinDespesa', methods=['PUT'])
def alt_fin_despesa():
    request = flask.request.get_json(force=True)
    cursor = db_connect.connect().cursor()
    cursor.execute('rollback')
    cursor.execute("""
                    UPDATE 
                        fin_despesas 
                    SET 
                        valor = %(valor)s, 
                        pessoa_ref = %(pessoa)s, 
                        forma_pgto = %(forma_pgto)s, 
                        quitada = %(quitada)s 
                    WHERE 
                        codigo = %(codigo)s
                """, request)
    cursor.connection.commit()
    cursor.close()
        
    return {}, 200



@app.route('/delFinDespesa', methods=['DELETE'])
def del_fin_despesa():
    request = flask.request.get_json(force=True)
    cursor = db_connect.connect().cursor()
    cursor.execute('rollback')
    cursor.execute("DELETE FROM fin_despesas WHERE codigo = %(codigo)s", request)
    cursor.connection.commit()
    cursor.close()
    
    return {}, 200



@app.route('/getContasPagar', methods=['GET'])
def show_contas_pagar():
    request = flask.request.args
    filtros = {}
    for arg in request.keys():
        if arg.__contains__('valor') == False:
            if request[arg] != '':
                filtros.update({arg: '%' + request[arg] + '%'})
            else:
                filtros.update({arg: ''})
        else:
            if request[arg] != '':
                filtros.update({arg: request[arg]})

    cursor = db_connect.connect().cursor()
    cursor.execute('rollback')
    cursor.execute("""
                    SELECT 
                        fd.codigo, 
                        fd.pessoa_ref, 
                        cp.nome AS pessoa, 
                        fd.valor, 
                        fd.forma_pgto, 
                        CASE 
                            WHEN fd.quitada = true 
                            THEN 'sim' 
                            
                            WHEN fd.quitada = false 
                            THEN 'não' 
                        END as quitada 
                    FROM fin_despesas fd 
                    LEFT JOIN cad_pessoas cp ON cp.codigo = fd.pessoa_ref 
                    WHERE
                        CASE
                            WHEN %(nome)s <> '' 
                            THEN cp.nome like %(nome)s
                            ELSE TRUE
                        END 
                    AND 
                        CASE
                            WHEN %(forma_pgto)s <> '' 
                            THEN fd.forma_pgto like %(forma_pgto)s
                            ELSE TRUE
                        END 
                    AND 
                        fd.valor BETWEEN
                            CASE
                                WHEN %(valor_minimo)s <> ''
                                THEN %(valor_minimo)s
                                ELSE 0
                            END 
                        AND
                            CASE
                                WHEN %(valor_maximo)s <> ''
                                THEN %(valor_maximo)s
                                ELSE 99999999.99
                            END 
                    AND
                        CASE
                            WHEN %(quitada)s <> '' 
                            THEN fd.quitada::varchar like %(quitada)s
                            ELSE TRUE
                        END
                    ORDER BY codigo
                    """, filtros)
    columns = [column[0] for column in cursor.description]
    rows = cursor.fetchall()
    result = []
    for row in rows:
        result.append(dict((zip(columns, row))))
    
    cursor.close()
    return json.dumps(result, cls=DecimalEncoder)
    
    
    
# retorno de resposta para o módulo de contas a receber
@app.route('/getTotalQuitado', methods=['GET'])
def show_total_quitado():
    cursor = db_connect.connect().cursor()
    cursor.execute('rollback')
    cursor.execute("SELECT SUM(valor) FROM fin_receitas WHERE quitada = true")
    result = cursor.fetchall()
    cursor.close()
    
    return json.dumps(result, cls=DecimalEncoder)
    


@app.route('/getTotalPendente', methods=['GET'])
def show_total_pendente():
    cursor = db_connect.connect().cursor()
    cursor.execute('rollback')
    cursor.execute("SELECT SUM(valor) FROM fin_receitas WHERE quitada = false")
    result = cursor.fetchall()
    cursor.close()
    
    return json.dumps(result, cls=DecimalEncoder)



# executa o app
if __name__ == '__main__':
    app.run("0.0.0.0", port=5000, debug=True, threaded=True)