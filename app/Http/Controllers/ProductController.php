<?php

namespace App\Http\Controllers;

use App\Http\Requests,
    Illuminate\Support\Facades\Response,
    \App\Product,
    Illuminate\Support\Facades\Input,
    Illuminate\Support\Facades\Validator,
    App\User,
    App\Http\Requests\ProductChangeRequest;

class ProductController extends Controller {

    protected function validator(array $data) {
        return Validator::make($data, [
                    'name' => 'required',
                    'person' => 'required|max:255',
                    'subiect' => 'required',
        ]);
    }

    public function create() {
        $input = Input::all();
        if (!empty($input['find'])) {
            $find = json_decode($input['find'], true);
        }
        $success = true;
        $data = Product::select('*');
        if (!empty($find)) {
            if (!empty($find['name'])) {
                $data = $data->whereRaw('LOWER(name) LIKE ?', ['%' . mb_strtolower($find['name'],'UTF-8') . '%']);
            }
            if (!empty($find['person'])) {
                $data = $data->whereRaw('LOWER(person) LIKE ?', ['%' . mb_strtolower($find['person'],'UTF-8') . '%']);
            }
            if (!empty($find['date'])) {
                $data = $data->whereBetween('created_at', array($find['date'] . ' 00:00:00', $find['date'] . ' 23:59:59'));
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
        
        $input['status'] = $input['status']['id'];

        if(!empty($input['updated_at'])) {
            $input['updated_at'] = date('Y-m-d');
        }

        $product = Product::createOrUpdate($input, $id);
        
        $success = true;

        return Response::json(compact('success', 'product'));
    }

    /**
     * Wyświetla produkt
     *
     * @param  int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id) {
        $product = Product::findById($id);

        if (empty($product)) {
            $error = 'Upss, wystąpił błąd! Spróbuj później.';
            return Response::json(compact('success', 'error'));
        }

        $success = true;

        return Response::json(compact('success', 'product'));
    }

    public function destroy($id) {
        $product = Product::findById($id);

        $success = false;

        if (empty($product)) {
            $error = 'Upss, wystąpił błąd! Spróbuj później.';
            return Response::json(compact('success', 'error'));
        }

        $product->delete();

        $success = true;

        return Response::json(compact('success'));
    }

}
