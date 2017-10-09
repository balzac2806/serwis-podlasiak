<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable,
    \Illuminate\Support\Facades\DB;

class CodeGenerator extends Authenticatable {

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

    CONST ENG_TEMPLATE = 1;
    CONST FR_TEMPLATE = 2;
    CONST GER_TEMPLATE = 3;
    CONST IT_TEMPLATE = 4;

    public static $templates = [
            ['key' => self::ENG_TEMPLATE, 'value' => 'Anglia'],
            ['key' => self::FR_TEMPLATE, 'value' => 'Francja'],
            ['key' => self::GER_TEMPLATE, 'value' => 'Niemcy'],
            ['key' => self::IT_TEMPLATE, 'value' => 'Włochy']
    ];
    public static $templatesElements = [
        self::ENG_TEMPLATE => [
                ['order' => 0, 'key' => 'product_name', 'label' => 'Nazwa produktu', 'type' => 'input', 'shortcode' => '<h1>[product_name]</h1>'],
                ['order' => 1, 'key' => 'product_description', 'label' => 'Opis produktu I', 'type' => 'input', 'shortcode' => '<p>[product_description]</p>'],
                ['order' => 2, 'key' => 'product_image_first', 'label' => 'Grafika produktu I', 'type' => 'input', 'shortcode' => '<img src="[product_image_first]"><br>'],
                ['order' => 3, 'key' => 'product_image_second', 'label' => 'Grafika produktu II', 'type' => 'input', 'shortcode' => '<img src="[product_image_second]"><br>'],
                ['order' => 4, 'key' => 'product_image_third', 'label' => 'Grafika produktu III', 'type' => 'input', 'shortcode' => '<img src="[product_image_third]"><br>'],
                ['order' => 5, 'key' => 'product_description_two', 'label' => 'Opis produktu II', 'type' => 'input', 'shortcode' => '<p>[product_description_two]</p>'],
                ['order' => 6, 'key' => 'product_image_four', 'label' => 'Grafika produktu IV', 'type' => 'input', 'shortcode' => '<img src="[product_image_four]"><br>'],
                ['order' => 7, 'key' => 'product_image_five', 'label' => 'Grafika produktu V', 'type' => 'input', 'shortcode' => '<img src="[product_image_five]"><br>'],
                ['order' => 8, 'key' => 'product_image_six', 'label' => 'Grafika produktu VI', 'type' => 'input', 'shortcode' => '<img src="[product_image_six]"><br>'],
                ['order' => 9, 'key' => 'product_description_three', 'label' => 'Opis produktu III', 'type' => 'input', 'shortcode' => '<p>[product_description_three]</p>'],
                ['order' => 10, 'key' => 'product_image_seven', 'label' => 'Grafika produktu VII', 'type' => 'input', 'shortcode' => '<img src="[product_image_seven]"><br>'],
                ['order' => 11, 'key' => 'product_image_eight', 'label' => 'Grafika produktu VIII', 'type' => 'input', 'shortcode' => '<img src="[product_image_eight]"><br>'],
                ['order' => 12, 'key' => 'product_image_nine', 'label' => 'Grafika produktu IX', 'type' => 'input', 'shortcode' => '<img src="[product_image_nine]"><br>'],
        ],
        self::FR_TEMPLATE => [
                ['order' => 0, 'key' => 'product_name', 'label' => 'Nazwa produktu', 'type' => 'input', 'shortcode' => '<h1>[product_name]</h1>'],
                ['order' => 1, 'key' => 'product_description', 'label' => 'Opis produktu I', 'type' => 'input', 'shortcode' => '<p>[product_description]</p>'],
                ['order' => 2, 'key' => 'product_image_first', 'label' => 'Grafika produktu I', 'type' => 'input', 'shortcode' => '<img src="[product_image_first]"><br>'],
                ['order' => 3, 'key' => 'product_image_second', 'label' => 'Grafika produktu II', 'type' => 'input', 'shortcode' => '<img src="[product_image_second]"><br>'],
                ['order' => 4, 'key' => 'product_image_third', 'label' => 'Grafika produktu III', 'type' => 'input', 'shortcode' => '<img src="[product_image_third]"><br>'],
                ['order' => 5, 'key' => 'product_description_two', 'label' => 'Opis produktu II', 'type' => 'input', 'shortcode' => '<p>[product_description_two]</p>'],
                ['order' => 6, 'key' => 'product_image_four', 'label' => 'Grafika produktu IV', 'type' => 'input', 'shortcode' => '<img src="[product_image_four]"><br>'],
                ['order' => 7, 'key' => 'product_image_five', 'label' => 'Grafika produktu V', 'type' => 'input', 'shortcode' => '<img src="[product_image_five]"><br>'],
                ['order' => 8, 'key' => 'product_image_six', 'label' => 'Grafika produktu VI', 'type' => 'input', 'shortcode' => '<img src="[product_image_six]"><br>'],
                ['order' => 9, 'key' => 'product_description_three', 'label' => 'Opis produktu III', 'type' => 'input', 'shortcode' => '<p>[product_description_three]</p>'],
                ['order' => 10, 'key' => 'product_image_seven', 'label' => 'Grafika produktu VII', 'type' => 'input', 'shortcode' => '<img src="[product_image_seven]"><br>'],
                ['order' => 11, 'key' => 'product_image_eight', 'label' => 'Grafika produktu VIII', 'type' => 'input', 'shortcode' => '<img src="[product_image_eight]"><br>'],
                ['order' => 12, 'key' => 'product_image_nine', 'label' => 'Grafika produktu IX', 'type' => 'input', 'shortcode' => '<img src="[product_image_nine]"><br>'],
        ],
        self::GER_TEMPLATE => [
                ['order' => 0, 'key' => 'product_name', 'label' => 'Nazwa produktu', 'type' => 'input', 'shortcode' => '<h1>[product_name]</h1>'],
                ['order' => 1, 'key' => 'product_description', 'label' => 'Opis produktu I', 'type' => 'input', 'shortcode' => '<p>[product_description]</p>'],
                ['order' => 2, 'key' => 'product_image_first', 'label' => 'Grafika produktu I', 'type' => 'input', 'shortcode' => '<img src="[product_image_first]"><br>'],
                ['order' => 3, 'key' => 'product_image_second', 'label' => 'Grafika produktu II', 'type' => 'input', 'shortcode' => '<img src="[product_image_second]"><br>'],
                ['order' => 4, 'key' => 'product_image_third', 'label' => 'Grafika produktu III', 'type' => 'input', 'shortcode' => '<img src="[product_image_third]"><br>'],
                ['order' => 5, 'key' => 'product_description_two', 'label' => 'Opis produktu II', 'type' => 'input', 'shortcode' => '<p>[product_description_two]</p>'],
                ['order' => 6, 'key' => 'product_image_four', 'label' => 'Grafika produktu IV', 'type' => 'input', 'shortcode' => '<img src="[product_image_four]"><br>'],
                ['order' => 7, 'key' => 'product_image_five', 'label' => 'Grafika produktu V', 'type' => 'input', 'shortcode' => '<img src="[product_image_five]"><br>'],
                ['order' => 8, 'key' => 'product_image_six', 'label' => 'Grafika produktu VI', 'type' => 'input', 'shortcode' => '<img src="[product_image_six]"><br>'],
                ['order' => 9, 'key' => 'product_description_three', 'label' => 'Opis produktu III', 'type' => 'input', 'shortcode' => '<p>[product_description_three]</p>'],
                ['order' => 10, 'key' => 'product_image_seven', 'label' => 'Grafika produktu VII', 'type' => 'input', 'shortcode' => '<img src="[product_image_seven]"><br>'],
                ['order' => 11, 'key' => 'product_image_eight', 'label' => 'Grafika produktu VIII', 'type' => 'input', 'shortcode' => '<img src="[product_image_eight]"><br>'],
                ['order' => 12, 'key' => 'product_image_nine', 'label' => 'Grafika produktu IX', 'type' => 'input', 'shortcode' => '<img src="[product_image_nine]"><br>'],
        ],
        self::IT_TEMPLATE => [
                ['order' => 0, 'key' => 'product_name', 'label' => 'Nazwa produktu', 'type' => 'input', 'shortcode' => '<h1>[product_name]</h1>'],
                ['order' => 1, 'key' => 'product_description', 'label' => 'Opis produktu I', 'type' => 'input', 'shortcode' => '<p>[product_description]</p>'],
                ['order' => 2, 'key' => 'product_image_first', 'label' => 'Grafika produktu I', 'type' => 'input', 'shortcode' => '<img src="[product_image_first]"><br>'],
                ['order' => 3, 'key' => 'product_image_second', 'label' => 'Grafika produktu II', 'type' => 'input', 'shortcode' => '<img src="[product_image_second]"><br>'],
                ['order' => 4, 'key' => 'product_image_third', 'label' => 'Grafika produktu III', 'type' => 'input', 'shortcode' => '<img src="[product_image_third]"><br>'],
                ['order' => 5, 'key' => 'product_description_two', 'label' => 'Opis produktu II', 'type' => 'input', 'shortcode' => '<p>[product_description_two]</p>'],
                ['order' => 6, 'key' => 'product_image_four', 'label' => 'Grafika produktu IV', 'type' => 'input', 'shortcode' => '<img src="[product_image_four]"><br>'],
                ['order' => 7, 'key' => 'product_image_five', 'label' => 'Grafika produktu V', 'type' => 'input', 'shortcode' => '<img src="[product_image_five]"><br>'],
                ['order' => 8, 'key' => 'product_image_six', 'label' => 'Grafika produktu VI', 'type' => 'input', 'shortcode' => '<img src="[product_image_six]"><br>'],
                ['order' => 9, 'key' => 'product_description_three', 'label' => 'Opis produktu III', 'type' => 'input', 'shortcode' => '<p>[product_description_three]</p>'],
                ['order' => 10, 'key' => 'product_image_seven', 'label' => 'Grafika produktu VII', 'type' => 'input', 'shortcode' => '<img src="[product_image_seven]"><br>'],
                ['order' => 11, 'key' => 'product_image_eight', 'label' => 'Grafika produktu VIII', 'type' => 'input', 'shortcode' => '<img src="[product_image_eight]"><br>'],
                ['order' => 12, 'key' => 'product_image_nine', 'label' => 'Grafika produktu IX', 'type' => 'input', 'shortcode' => '<img src="[product_image_nine]"><br>'],
        ]
    ];
    public static $templatesHtmls = [
        self::ENG_TEMPLATE => '<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0"/>
        <!--<link href="css/style.css" type="text/css" rel="stylesheet" media="screen,projection"/>-->
    </head>
    <body>
        <style media="screen">
            .footer *,body{margin:0;padding:0}.bigger-text,.centered,.content,.seller-name{text-align:center}html{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}*,:after,:before{-webkit-box-sizing:inherit;-moz-box-sizing:inherit;box-sizing:inherit}h1,h2,h3,h4,h5,h6{font-weight:900}a,a:active,a:focus,a:hover{color:#000}.header-bar a,.header-bar a:active,.header-bar a:focus,.header-bar a:hover{text-decoration:none;color:#21c178}.header-bar li,.header-bar li a{color:#000}body{font-family:Arial,sans-serif}.footer *{border:0}p{line-height:1.8}.container{max-width:1280px;margin:0 auto;padding-left:20px;padding-right:20px}.content img,.img-table,.img100p{max-width:100%}.header-bar{width:100%;clear:both}.header-bar ul{padding:0;vertical-align:middle;line-height:30px;margin-bottom:0}.header-bar ul li{display:inline-block;padding:0 40px 0 0}.seller-name{color:#fff;font-size:4rem}.content h1{font-size:3rem}.content p{font-size:1.4rem}.content img{height:auto;display:block;margin-left:auto;margin-right:auto}.footer h2{display:block;width:100%;padding-top:20px;padding-bottom:20px}.footer hr{background:0;border:0;border-bottom:1px solid #ccc;margin-bottom:20px}.footer>div>p{padding-top:10px;padding-bottom:10px}.footer,.footer-6,.footer-row{padding:0}.footer hr::before{content:\'\';width:120px;height:3px;border-bottom:4px solid #21c178;position:absolute;margin-top:-3px}.footer-3,.footer-4,.footer-6{display:inline-block;margin:0;height:auto}.footer-6{vertical-align:top;width:49.5%}.footer-6-first{padding:20px 20px 20px 0}.footer-6-second{padding:20px 0 20px 20px}.footer-4{width:32%;padding:20px;vertical-align:top}.footer-3{padding:0;width:24.6%}.footer-3 p{font-size:50%}.img100p{height:auto}.bigger-text{font-size:18px;line-height:24px;color:#000}@media only screen and (min-width:941px) and (max-width:1200px){.bigger-text{font-size:15px}}@media only screen and (max-width:940px){.container{max-width:920px;margin:0 auto;padding-left:20px;padding-right:20px}.header-bar ul{width:100%;text-align:center}.header-bar ul li{padding-right:20px;margin-top:10px}.seller-name{font-size:3rem;margin-top:1rem;margin-bottom:1rem}.content{margin-top:30px}.footer-4,.footer-6{width:100%;padding:0}.footer-3{width:49.5%;padding-top:0}}@media only screen and (max-width:480px){.header,.seller-name{padding-top:0;padding-bottom:0;margin:0}.header{padding-top:20px;padding-bottom:20px}.header-bar ul{margin-top:0;margin-bottom:0;padding:0}.header-bar ul li{width:100%;height:auto;padding:10px 0;margin:20px 0 0;text-align:left;font-size:1.2em}.header-bar ul li .marginleft{margin-left:30px}.seller-name{font-size:2rem}.footer-3,.footer-4,.footer-6{width:100%;padding:20px 0 0}}img{max-width:100%;height:auto}
        </style>
        <div class="wrap">
            <div class="container">
                <div class="header-bar">
                    <p>
                    <center>
                        Welcome to an auction of one of the greatest sellers on Ebay. Over 500 000 clients have already trusted us.
                    </center>
                    </p>
                </div>
                <div class="header">
                    <img src="https://www.tutumi.pl/szablon_ebay_nowy/eng/eu-homestyle.jpg" style="max-width: 100%; height: auto;" alt="eu-homestyle">
                </div>
                <div class="content">
<h1>[product_name]</h1>
<p>[product_description]</p>
<img src="[product_image_first]"><br>
<img src="[product_image_second]"><br>
<img src="[product_image_third]"><br>
<p>[product_description_two]</p>
<img src="[product_image_four]"><br>
<img src="[product_image_five]"><br>
<img src="[product_image_six]"><br>
<p>[product_description_three]</p>
<img src="[product_image_seven]"><br>
<img src="[product_image_eight]"><br>
<img src="[product_image_nine]"><br>
                </div>
                <div class="footer">
                    <div class="footer-row">
                        <div class="footer-6 footer-6-first">
                            <h2>Payment methods</h2>
                            <hr>
                            <table cellspacing="20">
                                <tr>
                                    <td width="140"><img style="max-width: 100%; height: auto;" src="https://www.tutumi.pl/szablon_ebay_nowy/eng/paypal.png" class="img-table" alt=""></td><td><p></p></td>
                                </tr>
                                <tr>
                                    <td width="140"><img style="max-width: 100%; height: auto;" src="https://www.tutumi.pl/szablon_ebay_nowy/eng/bank.png" class="img-table" alt=""></td><td>
                                        <b>Commerzbank Frankfurt (ODER)</b><br>
                                        Bank account number: 202051900<br>
                                        Bank code: 17040000<br>
                                        IBAN: DE45170400000202051900<br>
                                        BIC-CODE: COBADEFFXXX<br>
                                    </td>
                                </tr>
                            </table>
                            <br>
                            <p>On request, we can put receipt in Pounds or Euro.</p>
                        </div>
                        <div class="footer-6 footer-6-second">
                            <h2>Warranty</h2>
                            <hr>
                            <img style="max-width: 100%; height: auto;" src="https://www.tutumi.pl/szablon_ebay_nowy/eng/logos.jpg" alt="">
                            <br><br>
                            <p>We are an exclusive importer and a wholesaler of Rea, Tutumi, Bluegarden, Flexifit and Podlasiak brand products. We offer you high quality and resistant products that will last  long time. Your satisfaction is always our priority.</p>
                        </div>
                    </div>
                    <div class="footer-row">
                        <h2>Security</h2>
                        <hr>
                        <div class="footer-row centered">
                            <div class="footer-4">
                                <img src="https://www.tutumi.pl/szablon_ebay_nowy/eng/open.png" style="height: 122px; width: auto;" alt="">
                                <br><br>
                                <h3>Easy contact</h3>
                                <br>
                                <p>Do not hesitate to contact us in case of any problems and concerns.</p>
                            </div>
                            <div class="footer-4">
                                <img src="https://www.tutumi.pl/szablon_ebay_nowy/eng/yes.png" style="height: 122px; width: auto;" alt="">
                                <br><br>
                                <h3>Satisfaction</h3>
                                <br>
                                <p>Your satisfaction is our top priority.</p>
                            </div>
                            <div class="footer-4">
                                <img src="https://www.tutumi.pl/szablon_ebay_nowy/eng/help.png" style="height: 122px; width: auto;" alt="">
                                <br><br>
                                <h3>We will help You</h3>
                                <br>
                                <p>We are always willing to help you no matter how troublesome the case is.</p>
                            </div>
                            <br><br>
                            <p>If you have any questions or concerns - please contact us. We are able to solve any problem and satisfy You. We are always willing to help you.</p>
                        </div>
                    </div>
                    <div class="footer-row">
                        <h2>Shipping</h2>
                        <hr>
                        <p>All our products are carefully packed. Please check the package upon delivery. If you receive a damaged item please contact us within one week. If you happen to be unsatisfied with the purchase you can easily exchange it or return it.  It takes around 3-5  working days for orders to be delivered.</p>
                        <br>
                        <p style="font-weight: 900; font-size: 24px; border: 3px solid #21c178; padding: 20px; text-align: center; line-height: 30px;"><i>Shipping cost to Malta and other European countries may differ. Please contact us before placing the order. Thank you!<br></i></p>
                        <br>
                        <img src="https://www.tutumi.pl/szablon_ebay_nowy/eng/sped.jpg" class="img100p" alt="">
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>
',
        self::FR_TEMPLATE => '<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0"/>
<!--<link href="css/style.css" type="text/css" rel="stylesheet" media="screen,projection"/>-->
</head>
<body>

<style media="screen">

.footer *,body{margin:0;padding:0}.bigger-text,.centered,.content,.seller-name{text-align:center}html{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}*,:after,:before{-webkit-box-sizing:inherit;-moz-box-sizing:inherit;box-sizing:inherit}h1,h2,h3,h4,h5,h6{font-weight:900}a,a:active,a:focus,a:hover{color:#000}.header-bar a,.header-bar a:active,.header-bar a:focus,.header-bar a:hover{text-decoration:none;color:#21c178}.header-bar li,.header-bar li a{color:#000}body{font-family:Arial,sans-serif}.footer *{border:0}p{line-height:1.8}.container{max-width:1280px;margin:0 auto;padding-left:20px;padding-right:20px}.content img,.img-table,.img100p{max-width:100%}.header-bar{width:100%;clear:both}.header-bar ul{padding:0;vertical-align:middle;line-height:30px;margin-bottom:0}.header-bar ul li{display:inline-block;padding:0 40px 0 0}.seller-name{color:#fff;font-size:4rem}.content h1{font-size:3rem}.content p{font-size:1.4rem}.content img{height:auto;display:block;margin-left:auto;margin-right:auto}.footer h2{display:block;width:100%;padding-top:20px;padding-bottom:20px}.footer hr{background:0;border:0;border-bottom:1px solid #ccc;margin-bottom:20px}.footer>div>p{padding-top:10px;padding-bottom:10px}.footer,.footer-6,.footer-row{padding:0}.footer hr::before{content:\'\';width:120px;height:3px;border-bottom:4px solid #21c178;position:absolute;margin-top:-3px}.footer-3,.footer-4,.footer-6{display:inline-block;margin:0;height:auto}.footer-6{vertical-align:top;width:49.5%}.footer-6-first{padding:20px 20px 20px 0}.footer-6-second{padding:20px 0 20px 20px}.footer-4{width:32%;padding:20px;vertical-align:top}.footer-3{padding:0;width:24.6%}.footer-3 p{font-size:50%}.img100p{height:auto}.bigger-text{font-size:18px;line-height:24px;color:#000}@media only screen and (min-width:941px) and (max-width:1200px){.bigger-text{font-size:15px}}@media only screen and (max-width:940px){.container{max-width:920px;margin:0 auto;padding-left:20px;padding-right:20px}.header-bar ul{width:100%;text-align:center}.header-bar ul li{padding-right:20px;margin-top:10px}.seller-name{font-size:3rem;margin-top:1rem;margin-bottom:1rem}.content{margin-top:30px}.footer-4,.footer-6{width:100%;padding:0}.footer-3{width:49.5%;padding-top:0}}@media only screen and (max-width:480px){.header,.seller-name{padding-top:0;padding-bottom:0;margin:0}.header{padding-top:20px;padding-bottom:20px}.header-bar ul{margin-top:0;margin-bottom:0;padding:0}.header-bar ul li{width:100%;height:auto;padding:10px 0;margin:20px 0 0;text-align:left;font-size:1.2em}.header-bar ul li .marginleft{margin-left:30px}.seller-name{font-size:2rem}.footer-3,.footer-4,.footer-6{width:100%;padding:20px 0 0}}img{max-width:100%;height:auto}

</style>

<div class="wrap">

<div class="container">

<div class="header-bar">

<p>
<center>
	Bienvenue à la vente aux enchères de l\'un des plus gros vendeurs sur ebay. Nous avons déjà fait confiance à plus de 500 000 clients.
</center>
</p>

</div>

<div class="header">

<img src="https://www.tutumi.pl/szablon_ebay_nowy/fr/eu-homestyle.jpg" style="max-width: 100%; height: auto;" alt="eu-homestyle">

</div>

<div class="content">

<h1>[product_name]</h1>
<p>[product_description]</p>
<img src="[product_image_first]"><br>
<img src="[product_image_second]"><br>
<img src="[product_image_third]"><br>
<p>[product_description_two]</p>
<img src="[product_image_four]"><br>
<img src="[product_image_five]"><br>
<img src="[product_image_six]"><br>
<p>[product_description_three]</p>
<img src="[product_image_seven]"><br>
<img src="[product_image_eight]"><br>
<img src="[product_image_nine]"><br>

</div>

<div class="footer">

<div class="footer-row">

<div class="footer-6 footer-6-first">

<h2>Modes de paiement</h2>

<hr>


<table cellspacing="20">
<tr>
<td width="140"><img style="max-width: 100%; height: auto;" src="https://www.tutumi.pl/szablon_ebay_nowy/fr/paypal.png" class="img-table" alt=""></td><td><p></p></td>
</tr>
<tr>
<td width="140"><img style="max-width: 100%; height: auto;" src="https://www.tutumi.pl/szablon_ebay_nowy/fr/bank.png" class="img-table" alt=""></td><td>
Nos coordonnées bancaires:<br>
<b>Commerzbank Frankfurt (ODER)</b><br>
Bank account number: 202051900<br>
Bank code: 17040000<br>
IBAN: DE45170400000202051900<br>
BIC-CODE: COBADEFFXXX<br>
</td>
</tr>
</table>
<br>
<p>Non accepté: CR (contre remboursement), paiement par chèque.</p>

</div>

<div class="footer-6 footer-6-second">

<h2>Garantie</h2>

<hr>

<img style="max-width: 100%; height: auto;" src="https://www.tutumi.pl/szablon_ebay_nowy/fr/logos.jpg" alt="">

<br><br>

<p>Nous sommes les distributeurs de la marque Rea, Tutumi, Bluegarden, Flexifit en France. Tous nos produits sont fabriqués selon les normes de qualité les plus stricte. Tous nos produits sont soigneusement contrôlés et emballent professionnellement avant d\’être expédié.<br><br>Pour le bien de notre boutique n\'oubliez pas de nous laisser une évaluation positive avec 5 étoiles ★★★★★.</p>

</div>

</div>

<div class="footer-row">

<h2>Sécurité</h2>

<hr>

<div class="footer-row centered">

<div class="footer-4">

<img src="https://www.tutumi.pl/szablon_ebay_nowy/fr/open.png" style="height: 122px; width: auto;" alt="">
<br><br>
<h3>Service client</h3>
<br>

<p>Vous pouvez nous contacter via la messagerie eBay, habituellement, nous répondons sous une demi-heure durant nos heures d’ouverture.<br>Nous sommes ouverts du lundi au vendredi, de 7 h à 15h</p>

</div>

<div class="footer-4">

<img src="https://www.tutumi.pl/szablon_ebay_nowy/fr/yes.png" style="height: 122px; width: auto;" alt="">
<br><br>
<h3>Satisfaction</h3>
<br>

<p>Votre satisfaction est notre objectif le plus important.<br>
Vous n\'aurez jamais de surprise avec nos produits.
</p>

</div>

<div class="footer-4">

<img src="https://www.tutumi.pl/szablon_ebay_nowy/fr/help.png" style="height: 122px; width: auto;" alt="">
<br><br>
<h3>En cas de problème</h3>
<br>

<p>Si vous n\'êtes pas satisfait(e) entierement conactez avec nous via la messagerie Ebay avant de nous laisser une évaluation négative. Nous trouverons sûrement une solution.</p>

</div>

<br><br>

<p>Votre article ne vous convient pas ? Pas de panique ! Vous disposez d\'un délai de quatorze (14) jours pour nous le retourner.<br>Vous avez droit à une garantie légale de 2 ans.</p>

</div>

</div>

<div class="footer-row">

<h2>Livraison</h2>

<hr>

<p>
Frais de livraison en France, Luxembourg et Belgique sont <b>gratuit</b>. Nous traitons vos commandes avec <b>rapidité et efficacité</b> et nous vous contacterons immédiatement si vous avez besoin de renseignements supplémentaires pour traiter la commande. Nous expédions l’article dès la réception de votre paiement.
<br>Veuillez SVP laisser votre adresse complète et mentionner  le code d\'accès, l\'interphone et le numéro de d\'appt, s\'ils existent, quand vous passez la commande.
</p>

<br>

<p style="font-weight: 900; font-size: 24px; border: 3px solid #21c178; padding: 20px; text-align: center; line-height: 30px;"><i>Nous ne livrons pas à Monaco et dans les DOM TOM.<br>Le délai de livraison  3-5 jours ouvrables.<br></i></p>

<br>

<img src="https://www.tutumi.pl/szablon_ebay_nowy/fr/sped.jpg" class="img100p" alt="">

</div>

</div>

</div>

</div>

</body>
</html>
',
        self::GER_TEMPLATE => '<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0"/>
<!--<link href="css/style.css" type="text/css" rel="stylesheet" media="screen,projection"/>-->
</head>
<body>

<style media="screen">

.footer *,body{margin:0;padding:0}.bigger-text,.centered,.content,.seller-name{text-align:center}html{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}*,:after,:before{-webkit-box-sizing:inherit;-moz-box-sizing:inherit;box-sizing:inherit}h1,h2,h3,h4,h5,h6{font-weight:900}a,a:active,a:focus,a:hover{color:#000}.header-bar a,.header-bar a:active,.header-bar a:focus,.header-bar a:hover{text-decoration:none;color:#21c178}.header-bar li,.header-bar li a{color:#000}body{font-family:Arial,sans-serif}.footer *{border:0}p{line-height:1.8}.container{max-width:1280px;margin:0 auto;padding-left:20px;padding-right:20px}.content img,.img-table,.img100p{max-width:100%}.header-bar{width:100%;clear:both}.header-bar ul{padding:0;vertical-align:middle;line-height:30px;margin-bottom:0}.header-bar ul li{display:inline-block;padding:0 40px 0 0}.seller-name{color:#fff;font-size:4rem}.content h1{font-size:3rem}.content p{font-size:1.4rem}.content img{height:auto;display:block;margin-left:auto;margin-right:auto}.footer h2{display:block;width:100%;padding-top:20px;padding-bottom:20px}.footer hr{background:0;border:0;border-bottom:1px solid #ccc;margin-bottom:20px}.footer>div>p{padding-top:10px;padding-bottom:10px}.footer,.footer-6,.footer-row{padding:0}.footer hr::before{content:\'\';width:120px;height:3px;border-bottom:4px solid #21c178;position:absolute;margin-top:-3px}.footer-3,.footer-4,.footer-6{display:inline-block;margin:0;height:auto}.footer-6{vertical-align:top;width:49.5%}.footer-6-first{padding:20px 20px 20px 0}.footer-6-second{padding:20px 0 20px 20px}.footer-4{width:32%;padding:20px;vertical-align:top}.footer-3{padding:0;width:24.6%}.footer-3 p{font-size:50%}.img100p{height:auto}.bigger-text{font-size:18px;line-height:24px;color:#000}@media only screen and (min-width:941px) and (max-width:1200px){.bigger-text{font-size:15px}}@media only screen and (max-width:940px){.container{max-width:920px;margin:0 auto;padding-left:20px;padding-right:20px}.header-bar ul{width:100%;text-align:center}.header-bar ul li{padding-right:20px;margin-top:10px}.seller-name{font-size:3rem;margin-top:1rem;margin-bottom:1rem}.content{margin-top:30px}.footer-4,.footer-6{width:100%;padding:0}.footer-3{width:49.5%;padding-top:0}}@media only screen and (max-width:480px){.header,.seller-name{padding-top:0;padding-bottom:0;margin:0}.header{padding-top:20px;padding-bottom:20px}.header-bar ul{margin-top:0;margin-bottom:0;padding:0}.header-bar ul li{width:100%;height:auto;padding:10px 0;margin:20px 0 0;text-align:left;font-size:1.2em}.header-bar ul li .marginleft{margin-left:30px}.seller-name{font-size:2rem}.footer-3,.footer-4,.footer-6{width:100%;padding:20px 0 0}}img{max-width:100%;height:auto}

</style>

<div class="wrap">

<div class="container">

<div class="header-bar">

<p>
<center>
	Herzlich Willkommen in Angebot eines der größsten Verkäufer in Ebay! Über 500 000 Kunden haben schon uns vertraut.
</center>
</p>

</div>

<div class="header">

<img src="https://www.tutumi.pl/szablon_ebay_nowy/de/eu-homestyle.jpg" style="max-width: 100%; height: auto;" alt="eu-homestyle">

</div>

<div class="content">

<h1>[product_name]</h1>
<p>[product_description]</p>
<img src="[product_image_first]"><br>
<img src="[product_image_second]"><br>
<img src="[product_image_third]"><br>
<p>[product_description_two]</p>
<img src="[product_image_four]"><br>
<img src="[product_image_five]"><br>
<img src="[product_image_six]"><br>
<p>[product_description_three]</p>
<img src="[product_image_seven]"><br>
<img src="[product_image_eight]"><br>
<img src="[product_image_nine]"><br>

</div>

<div class="footer">

<div class="footer-row">

<div class="footer-6 footer-6-first">

<h2>Zahlungsmethoden</h2>

<hr>


<table cellspacing="20">
<tr>
<td width="140"><img style="max-width: 100%; height: auto;" src="https://www.tutumi.pl/szablon_ebay_nowy/de/paypal.png" class="img-table" alt=""></td><td><p></p></td>
</tr>
<tr>
<td width="140"><img style="max-width: 100%; height: auto;" src="https://www.tutumi.pl/szablon_ebay_nowy/de/bank.png" class="img-table" alt=""></td><td>
<b>Commerzbank Frankfurt (ODER)</b><br>
Bank account number: 202051900<br>
Bank code: 17040000<br>
IBAN: DE45170400000202051900<br>
BIC-CODE: COBADEFFXXX<br>
</td>
</tr>
</table>
</div>

<div class="footer-6 footer-6-second">

<h2>Garantie</h2>

<hr>

<img style="max-width: 100%; height: auto;" src="https://www.tutumi.pl/szablon_ebay_nowy/de/logos.jpg" alt="">

<br><br>

<p>
Wir sind Vertreiber von Marken: Rea, Tutumi, Bluegarden, Flexifit, Podlasiak in Deutschland. Unsere Waren sind aus dem besten Material hergestellt. Ein qualitativ hochwertiger Stoff verursacht, dass unsere Waren widerstandsfähige und solide sind. Ihre Zufriedenheit ist für uns am wichtigsten.
</p>

</div>

</div>

<div class="footer-row">

<h2>Sicherheit</h2>

<hr>

<div class="footer-row centered">

<div class="footer-4">

<img src="https://www.tutumi.pl/szablon_ebay_nowy/de/open.png" style="height: 122px; width: auto;" alt="">
<br><br>
<h3>Trust us</h3>
<br>

<p>
Bitte uns negative oder neutrale Bewertungen nicht abgeben. Wir können jedes Problem lösen. Im Fall, wenn Sie unzufrieden sind oder Ihre Meinung geändert haben – wir werden Ihnen immer helfen.
</p>

</div>

<div class="footer-4">

<img src="https://www.tutumi.pl/szablon_ebay_nowy/de/yes.png" style="height: 122px; width: auto;" alt="">
<br><br>
<h3>Zweifels?</h3>
<br>

<p>
Wenn Sie eine Frage haben, kontaktieren Sie uns. Wir stehen immer zur Verfügung. Wir antworten auf Ihre Fragen am selben Arbeitstag!
</p>

</div>

<div class="footer-4">

<img src="https://www.tutumi.pl/szablon_ebay_nowy/de/help.png" style="height: 122px; width: auto;" alt="">
<br><br>
<h3>Ihre Befriedigung</h3>
<br>

<p>
Wenn Sie unzufrieden sind und möchten Sie die Ware zurückgeben – bitte uns zuerst melden. Sie haben 14 Tagen ab Lieferung um Ihre Meinung ändern.
</p>

</div>

<br>

<p>Nach gelungene Transaktion werden wir sehr dankbar für positive Bewertung.
</p>

</div>

</div>

<div class="footer-row">

<h2>Versand</h2>

<hr>

<p>
Alle unsere Verpackund sind gut versichert und ausgepackt. Überprüfen Sie bitte Ihre Paket bei der Lieferung, ob es frei von Beschädigungen ist. Wenn nein, melden Sie uns bitte bis 1 Woche um Reklamation zu beschleunigen.
</p>

<br>

<p style="font-weight: 900; font-size: 24px; border: 3px solid #21c178; padding: 20px; text-align: center; line-height: 30px;"><i>

Lieferungszeit dauert 3-5 Arbeitstagen (nach Deutschland). Wir schicken die Waren auch nach andere Länder – vor Bestellung melden Sie uns bitte – wir schätzen evl. Zuzahlung für Transportkosten.

<br><br>Beim Einkaufen größeren Mengen der Produkten, bitte uns melden – Versandrabatte möglich !

</i></p>

<br>

<img src="https://www.tutumi.pl/szablon_ebay_nowy/de/sped.jpg" class="img100p" alt="">

</div>

</div>

</div>

</div>

</body>
</html>
',
        self::IT_TEMPLATE => '<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0"/>
<!--<link href="css/style.css" type="text/css" rel="stylesheet" media="screen,projection"/>-->
</head>
<body>

<style media="screen">

.footer *,body{margin:0;padding:0}.bigger-text,.centered,.content,.seller-name{text-align:center}html{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}*,:after,:before{-webkit-box-sizing:inherit;-moz-box-sizing:inherit;box-sizing:inherit}h1,h2,h3,h4,h5,h6{font-weight:900}a,a:active,a:focus,a:hover{color:#000}.header-bar a,.header-bar a:active,.header-bar a:focus,.header-bar a:hover{text-decoration:none;color:#21c178}.header-bar li,.header-bar li a{color:#000}body{font-family:Arial,sans-serif}.footer *{border:0}p{line-height:1.8}.container{max-width:1280px;margin:0 auto;padding-left:20px;padding-right:20px}.content img,.img-table,.img100p{max-width:100%}.header-bar{width:100%;clear:both}.header-bar ul{padding:0;vertical-align:middle;line-height:30px;margin-bottom:0}.header-bar ul li{display:inline-block;padding:0 40px 0 0}.seller-name{color:#fff;font-size:4rem}.content h1{font-size:3rem}.content p{font-size:1.4rem}.content img{height:auto;display:block;margin-left:auto;margin-right:auto}.footer h2{display:block;width:100%;padding-top:20px;padding-bottom:20px}.footer hr{background:0;border:0;border-bottom:1px solid #ccc;margin-bottom:20px}.footer>div>p{padding-top:10px;padding-bottom:10px}.footer,.footer-6,.footer-row{padding:0}.footer hr::before{content:\'\';width:120px;height:3px;border-bottom:4px solid #21c178;position:absolute;margin-top:-3px}.footer-3,.footer-4,.footer-6{display:inline-block;margin:0;height:auto}.footer-6{vertical-align:top;width:49.5%}.footer-6-first{padding:20px 20px 20px 0}.footer-6-second{padding:20px 0 20px 20px}.footer-4{width:32%;padding:20px;vertical-align:top}.footer-3{padding:0;width:24.6%}.footer-3 p{font-size:50%}.img100p{height:auto}.bigger-text{font-size:18px;line-height:24px;color:#000}@media only screen and (min-width:941px) and (max-width:1200px){.bigger-text{font-size:15px}}@media only screen and (max-width:940px){.container{max-width:920px;margin:0 auto;padding-left:20px;padding-right:20px}.header-bar ul{width:100%;text-align:center}.header-bar ul li{padding-right:20px;margin-top:10px}.seller-name{font-size:3rem;margin-top:1rem;margin-bottom:1rem}.content{margin-top:30px}.footer-4,.footer-6{width:100%;padding:0}.footer-3{width:49.5%;padding-top:0}}@media only screen and (max-width:480px){.header,.seller-name{padding-top:0;padding-bottom:0;margin:0}.header{padding-top:20px;padding-bottom:20px}.header-bar ul{margin-top:0;margin-bottom:0;padding:0}.header-bar ul li{width:100%;height:auto;padding:10px 0;margin:20px 0 0;text-align:left;font-size:1.2em}.header-bar ul li .marginleft{margin-left:30px}.seller-name{font-size:2rem}.footer-3,.footer-4,.footer-6{width:100%;padding:20px 0 0}}img{max-width:100%;height:auto}

</style>

<div class="wrap">

<div class="container">

<div class="header-bar">

<p>
<center>
	Benvenuti alle aste del uno dei piu grandi venditori su eBay. Ci ha fidato piu che 500 000 dei acquirenti.

</center>
</p>
</div>
<div class="header">
<img src="https://www.tutumi.pl/szablon_ebay_nowy/it/eu-homestyle.jpg" style="max-width: 100%; height: auto;" alt="eu-homestyle">
</div>
<div class="content">
<h1>[product_name]</h1>
<p>[product_description]</p>
<img src="[product_image_first]"><br>
<img src="[product_image_second]"><br>
<img src="[product_image_third]"><br>
<p>[product_description_two]</p>
<img src="[product_image_four]"><br>
<img src="[product_image_five]"><br>
<img src="[product_image_six]"><br>
<p>[product_description_three]</p>
<img src="[product_image_seven]"><br>
<img src="[product_image_eight]"><br>
<img src="[product_image_nine]"><br>
</div>
<div class="footer">
<div class="footer-row">
<div class="footer-6 footer-6-first">
<h2>Pagamenti accettati</h2>
<hr>
<table cellspacing="20">
<tr>
<td width="140"><img style="max-width: 100%; height: auto;" src="https://www.tutumi.pl/szablon_ebay_nowy/it/paypal.png" class="img-table" alt=""></td><td><p></p></td>
</tr>
<tr>
<td width="140"><img style="max-width: 100%; height: auto;" src="https://www.tutumi.pl/szablon_ebay_nowy/it/bank.png" class="img-table" alt=""></td><td>
<b>P. H. Podlasiak Andrzej Cylwik</b><br>
INTESA SANPAOLO<br>
IBAN: IT94 A030 6909 4201 0000 0003 778<br>
BIC: BCITITMMXXX<br>
KONTONUMMER: 1000/00003778</td>
</tr>
</table>

</div>

<div class="footer-6 footer-6-second">

<h2>Garanzia</h2>

<hr>

<img style="max-width: 100%; height: auto;" src="https://www.tutumi.pl/szablon_ebay_nowy/it/logos.jpg" alt="">

<br><br>

<p>Siamo importatore esclusivo di prodotti Rea, Tutumi, Bluegarden, Flexifit e Podlasiak. I nostri prodotti, solidi e resistenti , sono fatti di materiali di alta qualità sempre più elevata. Per noi la vostra soddisfazione viene al primo posto.</p>

</div>

</div>

<div class="footer-row">
<h2>Sicurezza</h2>
<hr>
<div class="footer-row centered">
<div class="footer-4">
<img src="https://www.tutumi.pl/szablon_ebay_nowy/it/open.png" style="height: 122px; width: auto;" alt="">
<br><br>
<h3>Facile contatto</h3>
<br>
<p>Per qualsiasi problema non esitateci a contattarci. Dal Lunedi al Venerdi  7-15:00.</p>
</div>
<div class="footer-4">
<img src="https://www.tutumi.pl/szablon_ebay_nowy/it/yes.png" style="height: 122px; width: auto;" alt="">
<br><br>
<h3>Soddisfazione</h3>
<br>
<p>La vostra soddisfazione viene al primo posto. </p>
</div>
<div class="footer-4">
<img src="https://www.tutumi.pl/szablon_ebay_nowy/it/help.png" style="height: 122px; width: auto;" alt="">
<br><br>
<h3>Ti aiuteremò</h3>
<br>
<p>Siamo sempre pronti ad aiutarvi.</p>
</div>
<br><br>
<p>Se non Vi piace o non siete sodisfatti del Vostro aquisto, potete tranquillamente cambiarlo o restituirlo.</p>
</div>
</div>
<div class="footer-row">
<h2>Soddisfazione</h2>
<hr>
<img src="https://www.tutumi.pl/szablon_ebay_nowy/it/satisfaction.png" alt="satisfaction" align="left" style="margin-right: 20px;">
<p>La qualità dei nostri prodotti si posiziona ai vertici delle rispettive categorie e le modalità di stoccaggio, imballaggio e di spedizione sono state studiate per garantirne la conservazione nel tempo. Premesso ciò tutti i nostri Clienti godono del diritto di recesso, esercitabile senza alcuna penalità, di recedere dal contratto secondo la previsioone dall\'art. 64 del D.lgs 206/2005; ciò permette di restituire il prodotto, previa comunicazione nel termine di 10 giorni dal ricevimento dello stesso ottenendone la sostituzione con un altro prodotto o il rimborso del corrispettivo pagato.</p>
</div>
<div class="footer-row">
<h2>Imballo & Spedizione</h2>
<hr>
<p style="font-weight: 900; font-size: 20px">Consegna a domicilio entro 4 - 6 giorni lavorativi</p>
<p>Facciamo il possibile affinché la merce arrivi integra! I nostri prodotti vengono accuratamente imballati. I pacchetti sono consegnati Lunedi - Venerdi. La consegna in Italia. Non è possibile avere una consegna per appuntamento ( l’ora e il giorno di consegna non dipende da noi).
<br>Vi preghiamo di apprire il pacco davanti al corriere. Se hai ricevuto un prodotto difettoso o danneggiato contattaci per aiuto durante una settimana.</p>
<br>
<p style="font-weight: 900; font-size: 24px; border: 3px solid #21c178; padding: 20px; text-align: center; line-height: 30px;"><i>Per la Sardegna il costo di spedizione è più alto. Per le spese di spedizione in Sardegna e altri paesi d\'Europea, non esitate a contattarci.<br></i></p>
<br>
<span style="text-align:center"><img src="https://www.tutumi.pl/szablon_ebay_nowy/it/spedycja.jpg" class="img100p" alt=""></span>
</div>
</div>
</div>
</div>
</body>
</html>
'
    ];

}
