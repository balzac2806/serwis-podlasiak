<?php

namespace App\Http\Controllers;

use App\Http\Requests,
    Illuminate\Support\Facades\Response,
    \App\Product,
    Illuminate\Support\Facades\Input,
    Illuminate\Support\Facades\Validator,
    App\User,
    App\Order,
    Illuminate\Support\Facades\DB,
    App\OrderProduct;

class OrderController extends Controller {

    protected function validator(array $data) {
        return Validator::make($data, [
                    'issuer' => 'required|max:255',
                    'checker' => 'required|max:255',
        ]);
    }

    protected function validatorUpdate(array $data) {
        return Validator::make($data, [
                    'issuer' => 'required|max:255',
                    'checker' => 'required|max:255',
                    'document_number' => 'required|max:255',
                    'authoriser' => 'required|max:255',
                    'date' => 'required|max:255',
        ]);
    }
    
    

    public function create() {
        $input = Input::all();
        if (!empty($input['find'])) {
            $find = json_decode($input['find'], true);
        }
        $success = true;
        $data = Order::select('*');
        if (!empty($find)) {
            if (!empty($find['name'])) {
                $data = $data->whereRaw('LOWER(name) LIKE ?', ['%' . strtolower($find['name']) . '%']);
            }
            if (!empty($find['person'])) {
                $data = $data->whereRaw('LOWER(issuer) LIKE ?', ['%' . strtolower($find['person']) . '%']);
            }
            if (!empty($find['sender'])) {
                $array = OrderProduct::select('order_id')->whereRaw('LOWER(sender) LIKE ?', ['%' . strtolower($find['sender']) . '%'])
                        ->get()->toArray();
                $data = $data->whereIn('id', array_column($array, 'order_id'));
            }
            if (!empty($find['number'])) {
                $array = OrderProduct::select('order_id')->whereRaw('LOWER(number) LIKE ?', ['%' . strtolower($find['number']) . '%'])
                        ->get()->toArray();
                $data = $data->whereIn('id', array_column($array, 'order_id'));
            }
            if (!empty($find['date'])) {
                $data = $data->whereBetween('date', array($find['date'] . ' 00:00:00', $find['date'] . ' 23:59:59'));
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

        if (!empty($id)) {
            $input['date'] = date('Y-m-d', strtotime($input['date']));
            $valid = $this->validatorUpdate($input);
            if ($valid->fails()) {
                $error = $valid->errors();
                return Response::json(compact('success', 'error'));
            }
            $input['status'] = 2;
        } else {
            $input['status'] = 1;
            $lastId = Order::select(DB::raw('max(id)'))->get()->toArray();
            $protocolId = !empty($lastId[0]['max'])? $lastId[0]['max'] + 1 : 1;
            $input['name'] = 'Protokół '.$protocolId;
            $valid = $this->validator($input);
            if ($valid->fails()) {
                $error = $valid->errors();
                return Response::json(compact('success', 'error'));
            }
        }

        if(!empty($input['updated_at'])) {
            $input['updated_at'] = date('Y-m-d');
        }
        
        $order = Order::createOrUpdate($input, $id);

        $success = true;

        return Response::json(compact('success', 'order'));
    }

    /**
     * Wyświetla produkt
     *
     * @param  int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id) {
        $order = Order::findById($id);

        if (empty($order)) {
            $error = 'Upss, wystąpił błąd! Spróbuj później.';
            return Response::json(compact('success', 'error'));
        }
        $order['date'] = date('Y-m-d', strtotime($order['date']));

        $success = true;

        return Response::json(compact('success', 'order'));
    }

    public function destroy($id) {
        $order = Order::findById($id);

        $success = false;

        if (empty($order)) {
            $error = 'Upss, wystąpił błąd! Spróbuj później.';
            return Response::json(compact('success', 'error'));
        }

        $order->delete();

        $success = true;

        return Response::json(compact('success'));
    }

}
