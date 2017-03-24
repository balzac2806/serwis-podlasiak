<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableMoneyReturns extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::create('money_returns', function (Blueprint $table) {
            $table->increments('id');
            $table->string('person')->nullable();
            $table->text('subiect')->nullable();
            $table->string('cost')->nullable();
            $table->timestamp('date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
           Schema::drop('money_returns');
    }

}
