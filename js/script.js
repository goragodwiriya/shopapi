var url = 'https://oas.kotchasan.com/api.php/v1/',
  req = new GAjax({'method':'GET'});
// ใช้ Ajax โหลดข้อมูลหมวดหมู่มาทำเป็นเมนู
req.send(
  url + "product/categories",
  null,
  function(xhr) {
    // แปลงข้อมูลตอบกลับเป็น JSON Object
    var ds = xhr.responseText.toJSON(),
      // menu element #categorymenu
      menu = $G("categorymenu");
    if (ds) {
      if (ds.error) {
        console.log(ds.error.message);
      } else {
        // วนลูปสร้างรายการเมนูหมวดหมู่
        for (var i in ds) {
          var li = menu.create("li");
          li.innerHTML =
            '<a href="index.html?category_id=' +
            ds[i].category_id +
            '" onclick="return getProducts(\'' +
            ds[i].category_id +
            "/1')\"><span>" +
            ds[i].topic +
            "</span></a>";
          li.id = ds[i].category_id + "/1";
        } // เรียกใช้งาน Javascript Drop Down Menu เพื่อให้รองรับ Responsive (ไม่ใช้ก็ได้)
        new GDDMenu("topmenu"); // อ่านค่าจาก Addressbar แล้วมาแยกเอา id หรือ category_id และ page ที่เป็น parameter ออก
        var urls = /((category_)?id)=([0-9]+)(&page=([0-9]+))?/.exec(
          window.location.toString()
        );
        if (urls && urls[1] == "category_id") {
          // ถ้ามี parameter ครบ ไปโหลดหน้าเว็บที่ต้องการมาแสดง
          getProducts(urls[3] + "/" + (urls[5] ? urls[5] : 1));
        } else if (urls && urls[1] == "id") {
          // แสดงรายละเอียดสินค้าที่กำหนด
          getProduct(urls[3]);
        } else {
          // ถ้าไม่มี ตรวจสอบ category_id จากเมนูรายการแรก
          urls = /category_id=([0-9]+)/.exec(menu.firstChild.firstChild.href);
          // แสดงหน้าแรก
          getProducts(urls[1] + "/1");
        }
      }
    }
  }
);

function getProduct(id) {
  // ใช้ Ajax โหลดข้อมูลตามที่เลือก
  req.send(
    url + "product/get/" + id,
    null,
    function(xhr) {
      // แปลงข้อมูลตอบกลับเป็น JSON Object
      var ds = xhr.responseText.toJSON(),
        detail = "";
      // #content ส่วนแสดงผลเนื้อหา
      content = $G("content");
      if (ds) {
        if (ds.error) {
          console.log(ds.error.message);
        } else {
          document.title = ds.topic;
          detail +=
            '<h2><a href="index.html?id=' + ds.id + '">' + ds.topic + "</a></h2>";
          detail += '<div class="ggrid product"><div class="float-left block6">';
          detail += '<img src="' + ds.image + '" alt="' + ds.topic + '">';
          detail += '</div><div class="float-left block6">';
          detail += "<h3>" + ds.description + "</h3>";
          detail += "<h4>รหัสสินค้า : " + ds.product_no + "</h4>";
          if (ds.detail) {
            detail += "<div>" + ds.detail + "</div>";
          }
          detail += "<p>ราคา <em>" + ds.price + "</em> บาท</p>";
          detail += '<p class="center pretty"><a href="' + ds.url + '" target=_blank class="button orange rounded large">สั่งซื้อ</a></p>';
          detail += "</div></div>";
          // แสดงผลข้อมูลลงใน #content
          content.innerHTML = detail;
          // เลื่อนขึ้นไปด้านบน
          window.scrollTo(0, content.getTop() - 10);
        }
      }
    }
  );
  return false;
}

function getProducts(id) {
  // ใช้ Ajax โหลดข้อมูลตามที่เลือก
  req.send(
    url + "product/products/" + id,
    "limit=20",
    function(xhr) {
      // แปลงข้อมูลตอบกลับเป็น JSON Object
      var ds = xhr.responseText.toJSON(),
        detail = "",
        item,
        col = 4,
        n = 0;
      // #content ส่วนแสดงผลเนื้อหา
      content = $G("content");
      if (ds) {
        if (ds.error) {
          console.log(ds.error.message);
        } else {
          document.title = ds.category;
          detail += "<h2>" + ds.category + "</h2>";
          // วนลูปรายการ ds.items เพื่อแสดงรายการสินค้า โดยใช้ griid ในการแสดงผล
          detail += '<div class="document-list thumbview"><div class="row">';
          for (var i in ds.items) {
            if (n > 0 && n % col == 0) {
              detail += '</div><div class="row">';
            }
            item = ds.items[i];
            detail += '<article class="col' + col + '">';
            detail +=
              '<a class="figure" href="index.html?id=' +
              item.id +
              '" onclick="return getProduct(' +
              item.id +
              ')">';
            detail +=
              '<img class=nozoom src="' +
              item.image +
              '" alt="' +
              item.topic +
              '">';
            detail += "</a><div>";
            detail +=
              '<h3><a href="index.html?id=' +
              item.id +
              '" onclick="return getProduct(' +
              item.id +
              ')">' +
              item.topic +
              "</a></h3>";
            detail += '<p class="price">' + item.price + " THB</p>";
            detail += "</div></article>";
            n++;
          }
          detail += "</div></div>";
          // ลิงค์รายการแบ่งหน้า (ถ้ามี)
          if (ds.totalpage > 0) {
            detail += '<footer class="splitpage">';
            for (i = 1; i <= ds.totalpage; i++) {
              if (i == ds.page) {
                detail += "<strong>" + i + "</strong>";
              } else {
                detail +=
                  '<a href="index.html?category_id=' +
                  ds.category_id +
                  "&amp;page=" +
                  i +
                  '" id="' +
                  ds.category_id +
                  "/" +
                  i +
                  '" onclick="return getProducts(\'' +
                  ds.category_id +
                  "/" +
                  i +
                  "')\">" +
                  i +
                  "</a>";
              }
            }
            detail += "</footer>";
          }
          // แสดงผลข้อมูลลงใน #content
          content.innerHTML = detail;
          // เลื่อนขึ้นไปด้านบน
          window.scrollTo(0, content.getTop() - 10);
        }
      }
    }
  );
  return false;
}