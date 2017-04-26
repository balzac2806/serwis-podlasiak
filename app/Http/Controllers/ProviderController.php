<?php

namespace App\Http\Controllers;

use App\Http\Requests,
    Illuminate\Support\Facades\Response,
    Illuminate\Support\Facades\Input,
    Illuminate\Support\Facades\Validator,
    App\Provider,
    Illuminate\Support\Facades\DB;

class ProviderController extends Controller {

    protected function validator(array $data) {
        return Validator::make($data, [
                    'name' => 'required|max:255',
        ]);
    }

    protected function validatorUpdate(array $data) {
        return Validator::make($data, [
                    'name' => 'required|max:255',
        ]);
    }

    public function create() {
        $input = Input::all();
        if (!empty($input['find'])) {
            $find = json_decode($input['find'], true);
        }
        $success = true;
        $data = Provider::select('*');
        if (!empty($find)) {
            if (!empty($find['name'])) {
                $data = $data->whereRaw('LOWER(name) LIKE ?', ['%' . mb_strtolower($find['name'],'UTF-8') . '%']);
            }
            if (!empty($find['date'])) {
                $data = $data->whereBetween('date', array($find['date'] . ' 00:00:00', $find['date'] . ' 23:59:59'));
            }
        }
        $data = $data->orderBy('id', 'desc')->get()->toArray();

        return Response::json(compact('success', 'data'));
    }

    public function store($id = null) {
        $input = Input::all();
        $input['status'] = $input['status']['id'];
        
        $success = false;
        
        $valid = $this->validator($input);
        if ($valid->fails()) {
            $error = $valid->errors();
            return Response::json(compact('success', 'error'));
        }

        $provider = Provider::createOrUpdate($input, $id);

        $success = true;

        return Response::json(compact('success', 'provider'));
    }

    /**
     * Wyświetla produkt
     *
     * @param  int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id) {
        $provider = Provider::findById($id);

        if (empty($provider)) {
            $error = 'Upss, wystąpił błąd! Spróbuj później.';
            return Response::json(compact('success', 'error'));
        }
        $provider['date'] = date('Y-m-d', strtotime($provider['date']));

        $success = true;

        return Response::json(compact('success', 'provider'));
    }

    public function destroy($id) {
        $provider = Provider::findById($id);

        $success = false;

        if (empty($provider)) {
            $error = 'Upss, wystąpił błąd! Spróbuj później.';
            return Response::json(compact('success', 'error'));
        }

        $provider->delete();

        $success = true;

        return Response::json(compact('success'));
    }

}
