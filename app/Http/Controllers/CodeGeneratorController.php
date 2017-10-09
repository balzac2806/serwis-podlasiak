<?php

namespace App\Http\Controllers;

use App\Http\Requests,
    Illuminate\Support\Facades\Response,
    Illuminate\Support\Facades\Input,
    Illuminate\Support\Facades\Validator,
    App\CodeGenerator,
    Illuminate\Support\Facades\DB;

class CodeGeneratorController extends Controller {

    public function index() {
        $templates = CodeGenerator::$templates;
        $template_elements = CodeGenerator::$templatesElements;
        $template_htmls = CodeGenerator::$templatesHtmls;

        $success = true;
        return Response::json(compact('success', 'templates', 'template_elements', 'template_htmls'));
    }

}
