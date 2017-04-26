<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateCorrectionsTableAddAdder extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::table('corrections', function (Blueprint $table) {
            $table->text('adder')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::table('corrections', function (Blueprint $table) {
            $table->dropColumn('adder');
        });
    }

}
