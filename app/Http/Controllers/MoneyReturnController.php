<?php

namespace App\Http\Controllers;

use App\Http\Requests,
    Illuminate\Support\Facades\Response,
    App\MoneyReturn,
    Illuminate\Support\Facades\Input,
    Illuminate\Support\Facades\Validator,
    App\User;

class MoneyReturnController extends Controller {

    protected function validator(array $data) {
        return Validator::make($data, [
                    'person' => 'required|max:255',
                    'subiect' => 'required',
                    'cost' => 'required',
        ]);
    }

    public function create() {
        $input = Input::all();
        if (!empty($input['find'])) {
            $find = json_decode($input['find'], true);
        }
        $success = true;
        $data = MoneyReturn::select('id','person', 'subiect', 'cost', 'date', 'time as hour', 'created_at', 'updated_at');
        if (!empty($find)) {
            if (!empty($find['person'])) {
                $data = $data->whereRaw('LOWER(person) LIKE ?', ['%' . mb_strtolower($find['person'],'UTF-8') . '%']);
            }
            if (!empty($find['subiect'])) {
                $data = $data->whereRaw('LOWER(subiect) LIKE ?', ['%' . mb_strtolower($find['subiect'],'UTF-8') . '%']);
            }
            if (!empty($find['cost'])) {
                $data = $data->whereRaw('LOWER(cost) LIKE ?', ['%' . mb_strtolower($find['cost'],'UTF-8') . '%']);
            }
            if (!empty($find['date'])) {
                $data = $data->whereBetween('date', array($find['date'] . ' 00:00:00', $find['date'] . ' 23:59:59'));
            }
        }
        $data = $data->orderBy('id','desc')->paginate(100);

        return Response::json(compact('success', 'data'));
    }

    public function store($id = null) {
        $input = Input::all();

        $success = false;
        
        $valid = $this->validator($input);
        if ($valid->fails()) {
            $error = $valid->errors();
            return Response::json(compact('success', 'error'));
        }
        
        if (!empty($input['date'])) {
            $input['date'] = $value = date('Y-m-d', strtotime($input['date']));
        }  else {
            $input['date'] = date('Y-m-d');
        }
        
        $data = MoneyReturn::createOrUpdate($input, $id);
        
        $success = true;

        return Response::json(compact('success', 'data'));
    }

    /**
     * Wyświetla produkt
     *
     * @param  int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id) {
        $data = MoneyReturn::findById($id);

        if (empty($data)) {
            $error = 'Upss, wystąpił błąd! Spróbuj później.';
            return Response::json(compact('success', 'error'));
        }

        $success = true;

        return Response::json(compact('success', 'data'));
    }

    public function destroy($id) {
        $data = MoneyReturn::findById($id);

        $success = false;

        if (empty($data)) {
            $error = 'Upss, wystąpił błąd! Spróbuj później.';
            return Response::json(compact('success', 'error'));
        }

        $data->delete();

        $success = true;

        return Response::json(compact('success'));
    }

}
