<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>bitefim</title>
</head>

<body style="background-color: black; color: white;">
    <h1>Hola como estamos</h1>
    <form action="/api/uploadFile" method="POST" enctype="multipart/form-data">
        @csrf
        <input type="file" name="file">
        <button type="submit">Upload File</button>
    </form>
</body>

</html>