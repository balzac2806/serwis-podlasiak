<?php

use Illuminate\Database\Seeder;
use App\User;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder {

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {
        User::create([
            'name' => 'Daniel Golubiewski',
            'email' => 'superadmin@podlasiak.pl',
            'password' => Hash::make('podlasiak2016$..'),
            'role' => 'admin',
        ]);
    }

}
