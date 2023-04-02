set curl_path=C:\Program Files\Git\mingw64\bin
set path=%curl_path%;%path%
rem curl
curl https://localhost/users --header "client: curl_client1" --cacer ca-crt.pem  --key client1-key.pem --cert client1-crt.pem  --verbose
pause
