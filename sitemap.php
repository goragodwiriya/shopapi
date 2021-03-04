<?php
$url = 'https://oas.kotchasan.com/api.php/v1/product/';
// header
header('Content-Type: application/xml; charset=UTF-8');
// XML
$content = '<'.'?xml version="1.0" encoding="UTF-8"?'.'>';
$content .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"';
$content .= ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"';
$content .= ' xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9';
$content .= ' http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">';
// ข้อมูลหมวดหมู่
$categories = json_decode(file_get_contents($url.'categories'));
// วันนี้
$date = date('Y-m-d');
foreach ($categories as $item) {
    $content .= '<url><loc>https://'.$_SERVER['HTTP_HOST'].'/index.html?category_id='.$item->category_id.'</loc><lastmod>'.$date.'</lastmod><changefreq>daily</changefreq><priority>0.5</priority></url>';
    $first = json_decode(file_get_contents($url.'products/'.$item->category_id.'/1'));
    foreach ($first->items as $item) {
        $content .= '<url><loc>https://'.$_SERVER['HTTP_HOST'].'/index.html?id='.$item->id.'</loc><lastmod>'.$date.'</lastmod><changefreq>daily</changefreq><priority>0.5</priority></url>';
    }
    for ($i = 2; $i <= $first->totalpage; $i++) {
        $products = json_decode(file_get_contents($url.'products/'.$item->category_id.'/'.$i));
        foreach ($products->items as $item) {
            $content .= '<url><loc>http://'.$_SERVER['HTTP_HOST'].'/index.html?id='.$item->id.'</loc><lastmod>'.$date.'</lastmod><changefreq>daily</changefreq><priority>0.5</priority></url>';
        }
    }
}
$content .= '</urlset>';
echo $content;
