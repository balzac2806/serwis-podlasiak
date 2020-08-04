<?php

namespace App\Http\Controllers;

use App\Http\Requests,
    Illuminate\Support\Facades\Response,
    Illuminate\Support\Facades\Input,
    Illuminate\Support\Facades\Validator,
    App\Correction,
    Illuminate\Support\Facades\DB;

class CorrectionController extends Controller {

    protected function validator(array $data) {
        return Validator::make($data, [
                    'name' => 'required|max:255',
                    'link' => 'required',
                    'description' => 'required',
        ]);
    }

    protected function validatorUpdate(array $data) {
        return Validator::make($data, [
                    'name' => 'required|max:255',
                    'link' => 'required',
                    'description' => 'required',
        ]);
    }

    public function create() {
        $input = Input::all();
        if (!empty($input['find'])) {
            $find = json_decode($input['find'], true);
        }
        $success = true;
        $data = Correction::select('*');
        if (!empty($find)) {
            if (!empty($find['name'])) {
                $data = $data->whereRaw('LOWER(name) LIKE ?', ['%' . mb_strtolower($find['name'],'UTF-8') . '%']);
            }
            if (!empty($find['date'])) {
                $data = $data->whereBetween('created_at', array($find['date'] . ' 00:00:00', $find['date'] . ' 23:59:59'));
            }
        }
        $data = $data->orderBy('id', 'desc')->paginate(100);

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

        $correction = Correction::createOrUpdate($input, $id);

        $success = true;

        return Response::json(compact('success', 'correction'));
    }

    /**
     * Wyświetla produkt
     *
     * @param  int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id) {
        $correction = Correction::findById($id);

        if (empty($correction)) {
            $error = 'Upss, wystąpił błąd! Spróbuj później.';
            return Response::json(compact('success', 'error'));
        }

        $success = true;

        return Response::json(compact('success', 'correction'));
    }

    public function destroy($id) {
        $correction = Correction::findById($id);

        $success = false;

        if (empty($correction)) {
            $error = 'Upss, wystąpił błąd! Spróbuj później.';
            return Response::json(compact('success', 'error'));
        }

        $correction->delete();

        $success = true;

        return Response::json(compact('success'));
    }

}
