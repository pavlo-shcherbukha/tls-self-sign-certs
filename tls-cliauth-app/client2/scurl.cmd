set curl_path=C:\Program Files\Git\mingw64\bin
set path=%curl_path%;%path%
rem curl
curl https://localhost/users --cacer ca-crt.pem --verbose
pause
