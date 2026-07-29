<?php
/**
 * Resuelve un link de Google Maps y devuelve sus coordenadas.
 *
 * Los links cortos (maps.app.goo.gl) responden con una redireccion que el
 * navegador no puede seguir por CORS. El sitio es un export estatico sin
 * servidor de Node, asi que esto lo resuelve PHP en el mismo hosting: al ser
 * el mismo dominio, no hay CORS de por medio.
 *
 * Se acepta unicamente POST con {"url": "..."} y solo dominios de Google, para
 * que esto no quede como un proxy abierto hacia cualquier servidor.
 */

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

function salir(array $body, int $status = 200): void {
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    salir(['error' => 'Metodo no permitido.'], 405);
}

$raw  = file_get_contents('php://input');
$body = json_decode($raw, true);
$url  = trim((string)($body['url'] ?? ''));

if ($url === '') {
    salir(['error' => 'Pegá el link de Google Maps.'], 400);
}

/** Solo https/http hacia dominios de Google. */
function url_permitida(string $raw): bool {
    $p = parse_url($raw);
    if (!$p || !isset($p['scheme'], $p['host'])) return false;
    if (!in_array(strtolower($p['scheme']), ['http', 'https'], true)) return false;

    $host = strtolower($p['host']);

    // El sufijo se limita a uno o dos rotulos de 2 o 3 letras (com, com.py,
    // co.uk). Permitir puntos libres dejaria pasar google.com.dominio-ajeno.com.
    $sufijo = '(\.[a-z]{2,3}){1,2}';

    return $host === 'maps.app.goo.gl'
        || $host === 'goo.gl'
        || preg_match('/^maps\.google' . $sufijo . '$/', $host) === 1
        || preg_match('/^(www\.)?google' . $sufijo . '$/', $host) === 1;
}

if (!url_permitida($url)) {
    salir(['error' => 'El link tiene que ser de Google Maps (google.com/maps o maps.app.goo.gl).'], 400);
}

/** Saca lat/lng de una URL de Google Maps ya resuelta. */
function extraer_coordenadas(string $texto): ?array {
    $patrones = [
        '/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/',                            // punto exacto del lugar
        '/@(-?\d+\.\d+),(-?\d+\.\d+)/',                                // centro de la vista
        '/[?&](?:q|query|ll|center|daddr)=(-?\d+\.\d+),\s*(-?\d+\.\d+)/',
        '/\/search\/(-?\d+\.\d+),\+?(-?\d+\.\d+)/',
    ];

    foreach ($patrones as $re) {
        if (preg_match($re, $texto, $m)) {
            $lat = (float)$m[1];
            $lng = (float)$m[2];
            if (abs($lat) <= 90 && abs($lng) <= 180 && !($lat == 0.0 && $lng == 0.0)) {
                return ['lat' => $lat, 'lng' => $lng];
            }
        }
    }
    return null;
}

// Si el link ya trae las coordenadas, no hace falta salir a la red.
$directo = extraer_coordenadas($url);
if ($directo) salir($directo);

if (!function_exists('curl_init')) {
    salir(['error' => 'El hosting no tiene cURL disponible. Usá el link largo de Google Maps.'], 501);
}

$ch = curl_init($url);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_MAXREDIRS      => 8,
    CURLOPT_TIMEOUT        => 12,
    CURLOPT_CONNECTTIMEOUT => 8,
    CURLOPT_PROTOCOLS      => CURLPROTO_HTTP | CURLPROTO_HTTPS,
    CURLOPT_REDIR_PROTOCOLS => CURLPROTO_HTTP | CURLPROTO_HTTPS,
    // Sin un user agent de navegador, Google devuelve una version reducida.
    CURLOPT_USERAGENT      => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36',
    CURLOPT_HTTPHEADER     => ['Accept-Language: es'],
]);

$respuesta = curl_exec($ch);
$final     = (string)curl_getinfo($ch, CURLINFO_EFFECTIVE_URL);
$err       = curl_error($ch);
curl_close($ch);

if ($respuesta === false) {
    salir(['error' => 'No se pudo resolver el link. Revisá que sea correcto y volvé a intentar.' . ($err ? " ($err)" : '')], 502);
}

// La URL final de la redireccion es la fuente confiable: trae el punto del
// lugar. A proposito no se lee el HTML: probado con dos lugares distintos
// devuelve siempre el mismo punto, que es el centro por defecto del mapa.
$coords = extraer_coordenadas($final);
if ($coords) salir($coords);

salir([
    'error' => 'Ese link no trae coordenadas. Abrilo en Google Maps y copiá el link largo desde la barra de direcciones, o marcá el punto y usá “Compartir”.'
], 422);
