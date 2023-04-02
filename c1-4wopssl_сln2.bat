"C:\Program Files\Git\mingw64\bin"\openssl.exe genrsa -out client2-key.pem 4096
"C:\Program Files\Git\mingw64\bin"\openssl.exe req -new -config client2.cnf -key client2-key.pem -out client2-csr.pem
"C:\Program Files\Git\mingw64\bin"\openssl.exe x509 -req -extfile client2.cnf -days 999 -passin "pass:password" -in client2-csr.pem -CA ca-crt.pem -CAkey ca-key.pem -CAcreateserial -out client2-crt.pem
"C:\Program Files\Git\mingw64\bin"\openssl.exe verify -CAfile ca-crt.pem client2-crt.pem