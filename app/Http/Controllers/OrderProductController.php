<?php

namespace App\Http\Controllers;

use App\Http\Requests,
    Illuminate\Support\Facades\Response,
    \App\Product,
    Illuminate\Support\Facades\Input,
    Illuminate\Support\Facades\Validator,
    App\User,
    App\OrderProduct,
    Illuminate\Support\Facades\DB;

class OrderProductController extends Controller {

    protected function validator(array $data) {
        return Validator::make($data, [
                    'order_id' => 'integer',
                    'name' => 'required|max:255',
                    'status' => 'max:255',
                    'country' => 'max:255',
                    'number' => 'required|max:255',
                    'sender' => 'required|max:255',
        ]);
    }

    public function create() {
        $input = Input::all();

        $success = true;

        $data = OrderProduct::select('*')->where('order_id', $input['order_id']);
        $data = $data->get()->toArray();

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

        if (!empty($input['updated_at'])) {
            $input['updated_at'] = date('Y-m-d');
        }
        
        if (!empty($input['date'])) {
            $input['date'] = date('Y-m-d', strtotime($input['date']));
        } 
        
        $product = OrderProduct::createOrUpdate($input, $id);

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
        $product = OrderProduct::findById($id);

        if (empty($product)) {
            $error = 'Upss, wystąpił błąd! Spróbuj później.';
            return Response::json(compact('success', 'error'));
        }

        $success = true;

        return Response::json(compact('success', 'product'));
    }

    public function destroy($id) {
        $product = OrderProduct::findById($id);

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
