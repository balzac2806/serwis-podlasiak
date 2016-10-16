<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateOrderProductsTableAddColumnDateNumberDocument extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::table('order_products', function (Blueprint $table) {
            $table->string('document_number')->nullable();
            $table->timestamp('date')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        chema::table('order_products', function (Blueprint $table) {
            $table->dropColumn('document_number');
            $table->dropColumn('date');
        });
    }

}
