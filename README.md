# tls-self-sign-certs Набрі кроків для генерації самопідписних TLS  сертифікатів

# Вступ

Дуже часто  при розроці сервісів потріно вбудовувати шифрувати канал. Це вимагає доопрацвання програмного забезпечення. Для того щоб швидко знегерувати TLS  сертифікати та перевірити працездатність і розролений цей репоизиторій. Ну, і ще, часто приходиться робити моделі зовнішніх сервісів. А зовнішні сервіси працюють по TLS і, щоб відлагодити програмен забезпечення,  роблю моделі, уже з TLS  шифруванням, що не переналаштовувати протоколи.

Існує два варіанти TLS  аутентифікації:

- Серверна

Коли клієнт запитує у сервера  кореневий сертифікат ЦСК, яким завірені серверний сертифікат, а звіряє з тим, що є в наявності у клієнта. Це найбільш масовий метод. У всіх кліжнтів в нявності тільки один  CA-сертифікат. А на сервері: CA-сертифікат, серврений ключ, серверний сертифікат, завірений CA  (Certificate Authorities).

- Клієнтська (або взаємна)

В даном випадку, сервер запитує у клієнта, його клієнтський сертифікат.  При цьому на  сервері: CA-сертифікат, серврений ключ, серверний сертифікат, завірений CA  (Certificate Authorities). На  клієнті CA-сертифікат, клієнтський ключ, клієнтський сертифікат завірений CA. Цей варіант менш розповсюджений. Відверто кажучи, мені тільки раз попадався в практичній роботі.

## Набори команд для генерації сертифікатів

Комнади розраховані на використання openssl від git,  що є на windows Laptop. Я розумію, що це не кашерно зараз. Але що маю, те і використовую. Кому потрібно замінять cmd на sh скрипт. 

## STEP-1  Налаштувати конфігураційні фали

Щоб на вводити  велику кількість схожих даних, що потім викличе помилки, які важко діагностувати, початкові дані для генераціх ключів винесені в конвфгураційні файли:

- ca.cnf  конфігураційний файл для генерації кореневого ключа та сертифіката (імітація ЦСК), яким потім будуть завірятися сертифікат сервера.

```text
[ ca ]
default_ca      = CA_default

[ CA_default ]
serial = ca-serial
crl = ca-crl.pem
database = ca-database.txt
name_opt = CA_default
cert_opt = CA_default
default_crl_days = 9999
default_md = md5

[ req ]
default_bits           = 4096
days                   = 9999
distinguished_name     = req_distinguished_name
attributes             = req_attributes
prompt                 = no
output_password        = password

[ req_distinguished_name ]
C                      = UA
ST                     = KY
L                      = Kyiv
O                      = pasha panama
OU                     = developer
CN                     = ca
emailAddress           = certs@developer.com

[ req_attributes ]
challengePassword      = test
```

- server.cnf  конфігураційни файл для генерації сервеного ключа та сертифіката
В даному випадку, сертифікат генерується для localhost **CN = localhost**

```text
[ req ]
default_bits           = 4096
days                   = 9999
distinguished_name     = req_distinguished_name
attributes             = req_attributes
prompt                 = no
x509_extensions        = v3_ca

[ req_distinguished_name ]
C                      = UA
ST                     = KY
L                      = Kyiv
O                      = pasha panama
OU                     = developer
CN                     = localhost
emailAddress           = certs@developer.com

[ req_attributes ]
challengePassword      = password

[ v3_ca ]
authorityInfoAccess = @issuer_info

[ issuer_info ]
OCSP;URI.0 = http://ocsp.developer.com/
caIssuers;URI.0 = http://developer.com/ca.cert
```
Тепер по кроках

### STEP 1 - c1wopssl.bat генерація кореневого сертифіката 
Запукається c1wopssl.bat
виконує команду генерації ключа ca-key.pem та сертифіката ca-crt.pem, використовуючи конфігураційний файл ca.cnf.  По суті емулює ключ Центра Сертифікації  (Certificate Authorities)

```bash
openssl.exe req -new -x509 -days 9999 -config ca.cnf -keyout ca-key.pem -out ca-crt.pem
```

В результаті виконання команди отримаємо 2 файли 
- ca-key.pem приватний ключ
- ca-crt.pem публічний ключ (він же сертифікат)

### STEP-2 - 2wopssl.bat  генерація серверного ключа

Зпускається 2wopssl.bat. В результаті виконання створюється серверний приватний ключ server-key.pem 

```bash
openssl.exe genrsa -out server-key.pem 4096

```

### STEP-3 - 3wopssl.bat  Генерує запит на сертифікат для серверного ключа

Зпускається 3wopssl.bat. В результаті виконання буде створено server-csr.pem. При створенні запиту на сертифікат вкиористовується конфігураційний файл **server.cnf**.

 ```bash
    openssl.exe req -new -config server.cnf -key server-key.pem -out server-csr.pem
 ```

 ### STEP-4 - 4wopssl.bat  Генеруємо підписанй CA ключем  (Certificate Authorities) серверний сертифікат

В результаті викнання команди отримаємо файл server-crt.pem що публічним сертифікатом серверного ключа

 ```bash
openssl.exe x509 -req -extfile server.cnf -days 999 -passin "pass:password" -in server-csr.pem -CA ca-crt.pem -CAkey ca-key.pem -CAcreateserial -out server-crt.pem

 ```

 ### У підсумку створено:
 
 - для клієнтів сервіса створено CA-сертифікат ca-crt.pem
 - для сервера з хостом localhost створено  пара приватного та публічного ключів: server-key.pem,  server-crt.pem та  CA-сертифікат ca-crt.pem.

 На цьому створення необхідних атрибутів для створення TLS  з'єднання с серверною аутентифікацією для host localhost  виконано.

 Для пеегляду реквізитів сертифікатів можна викнати view-crt.bat  передавши в якості параметра файл сертифіката

 ```bash
view-crt.bat server-crt.pem 
 ```
 В результаті отрмаємо файл  server-crt.pem.app 

 ```text
Certificate:
    Data:
        Version: 3 (0x2)
        Serial Number:
            09:86:94:df:96:28:99:85:80:80:6d:a3:e3:90:7b:9c:b6:3b:f6:c1
        Signature Algorithm: sha256WithRSAEncryption
        Issuer: C = UA, ST = KY, L = Kyiv, O = pasha panama, OU = developer, CN = ca, emailAddress = certs@developer.com
        Validity
            Not Before: Apr  1 19:57:06 2023 GMT
            Not After : Dec 25 19:57:06 2025 GMT
        Subject: C = UA, ST = KY, L = Kyiv, O = pasha panama, OU = developer, CN = localhost, emailAddress = certs@developer.com
        Subject Public Key Info:
            Public Key Algorithm: rsaEncryption

 ``` 
І тут видно, що  цей сертифікат завірений кореневим сертифікатом (реквізит issuer)

За допомогою  view-key.bat можна переглянути реквізити ключа. Але там корисного тільки алгоритм, як на мене. 



