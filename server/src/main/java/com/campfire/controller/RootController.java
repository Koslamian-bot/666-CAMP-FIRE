package com.campfire.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class RootController {

    @GetMapping(value = {"/", "/{path:[^\\.]*}", "/{path1:[^\\.]*}/{path2:[^\\.]*}"})
    public String forward() {
        return "forward:/index.html";
    }

    @GetMapping("/health")
    @ResponseBody
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Campfire burning bright 🔥");
    }
}
