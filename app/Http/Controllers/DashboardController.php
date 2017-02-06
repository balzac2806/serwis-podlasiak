<?php

namespace App\Http\Controllers;

use App\Http\Requests,
    Illuminate\Support\Facades\Response,
    \App\Dashboard,
    Illuminate\Support\Facades\Input,
    Illuminate\Support\Facades\Validator,
    Illuminate\Support\Facades\DB;

class DashboardController extends Controller {

    protected function validator(array $data) {
        return Validator::make($data, [
                    'content' => 'required'
        ]);
    }

    protected function validatorUpdate(array $data) {
        return Validator::make($data, [
                    'content' => 'required'
        ]);
    }

    public function store($id = null) {
        $input = Input::all();

        if(!empty($input['id'])) {
            $id = $input['id'];
        }

        $dashboard = Dashboard::createOrUpdate($input, $id);

        $success = true;

        return Response::json(compact('success', 'dashboard'));
    }

    /**
     * Wyświetla produkt
     *
     * @param  int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show() {
        $dashboard = Dashboard::getContent();

        if (empty($dashboard)) {
            $error = 'Upss, wystąpił błąd! Spróbuj później.';
            return Response::json(compact('success', 'error'));
        }
        
        $success = true;

        return Response::json(compact('success', 'dashboard'));
    }

}
