<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>rebar | demo</title>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.css">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.css">
    </head>
    <body>
        <script src="https://code.jquery.com/jquery-1.9.1.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
        <script src="/js/closure-library/closure/goog/base.js"></script>
        <script src="/js/deps.js"></script> 
        <script src="/js/main.js"></script> 
        <script type="text/javascript">
            goog.require('rebar.demo.Main');
        </script>
        <script type="text/javascript">
            __rebarDemo.serve();
        </script>
    </body>
</html>
