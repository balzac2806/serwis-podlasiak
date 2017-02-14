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
                $data = $data->whereRaw('LOWER(name) LIKE ?', ['%' . strtolower($find['name']) . '%']);
            }
            if (!empty($find['person'])) {
                $data = $data->whereRaw('LOWER(person) LIKE ?', ['%' . strtolower($find['person']) . '%']);
            }
            if (!empty($find['date'])) {
                $data = $data->whereBetween('created_at', array($find['date'] . ' 00:00:00', $find['date'] . ' 23:59:59'));
            }
        }
        $data = $data->get()->toArray();

        $sortArray = array();

        foreach ($data as $product) {
            foreach ($product as $key => $value) {
                if (!isset($sortArray[$key])) {
                    $sortArray[$key] = array();
                }
                $sortArray[$key][] = $value;
            }
        }

        if (!empty($data)) {
            if (!empty($input['sort']) && !empty($data)) {
                $sort = ($input['sort'] == 'name') ? SORT_ASC : SORT_DESC;
                $orderby = $input['sort'];
                array_multisort($sortArray[$orderby], $sort, $data);
            } else {
                $sort = SORT_ASC;
                $orderby = 'name';
                array_multisort($sortArray[$orderby], $sort, $data);
            }
        }

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
