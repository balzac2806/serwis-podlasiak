<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable,
    \Illuminate\Support\Facades\DB;

class Dashboard extends Authenticatable {

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'content'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];
    
    protected $table = 'dashboard';

    public static function getContent() {
        $dashboard = DB::table('dashboard')
                ->orderBy('id', 'asc')
                ->first();
        return $dashboard;
    }
    
    /**
     * Zwraca dashboard po kluczu id.
     * @param int $id
     * @return \User|static|null
     */
    public static function findById($id) {
        $query = self::where('id', '=', $id);

        return $query->first();
    }
    
    /**
     * Tworzy lub edytuje użytkownika
     * @param array $input
     * @param int $id
     * @return User
     */
    public static function createOrUpdate($input, $id = null) {
        $dashboard = !empty($id) ? Dashboard::findById($id) : new Dashboard;
        $dashboard->fill($input);

        $dashboard->save();

        return $dashboard;
    }

}
