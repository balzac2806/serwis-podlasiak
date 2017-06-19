<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateOrderProductsTableAddEditorColumn extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
   public function up() {
        Schema::table('order_products', function (Blueprint $table) {
            $table->text('editor')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::table('order_products', function (Blueprint $table) {
            $table->dropColumn('editor');
        });
    }
}
