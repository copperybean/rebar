port=${1-9527}
debug_port=${2-9007}
java -Xdebug -Xrunjdwp:server=y,transport=dt_socket,address=$debug_port,suspend=n -jar target-debug/rebar-demo-big-schedule.war --spring.resources.static-locations=classpath:/META-INF/resources/,classpath:/resources/,classpath:/public/,file:target-debug/classes/static/js --server.port=$port -Xdebug
