(function() {
    /* ============================================================
     * 菜单数据：三个食堂 × 三个时段
     * 每个菜品包含：name, price, desc, img, ingredients, calories, stock
     * 新增菜品只需在对应数组中添加对象即可
     * ============================================================ */
    var canteenData = {
        '1': {
            breakfast: [
                { name: '豆浆', price: 3, desc: '现磨浓香，暖胃首选', img: 'https://images.unsplash.com/photo-1571947421428-4103c3e0b9e8?w=400&h=300&fit=crop', ingredients: '黄豆、水、白糖', calories: '35kcal/杯', stock: 50 },
                { name: '油条', price: 4, desc: '金黄酥脆，经典搭配', img: 'https://images.unsplash.com/photo-1608767221051-2b9d18f35a2f?w=400&h=300&fit=crop', ingredients: '面粉、食用油、明矾', calories: '390kcal/根', stock: 40 },
                { name: '小笼包', price: 10, desc: '皮薄馅多，汁水充盈', img: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&h=300&fit=crop', ingredients: '猪肉、面粉、葱姜', calories: '230kcal/笼', stock: 30 },
                { name: '白粥', price: 2, desc: '清淡养胃，搭配小菜', img: 'https://images.unsplash.com/photo-1585238341710-4d3ff484184d?w=400&h=300&fit=crop', ingredients: '大米、水', calories: '46kcal/碗', stock: 60 },
                { name: '煎蛋', price: 3, desc: '外焦里嫩，蛋白丰富', img: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=300&fit=crop', ingredients: '鸡蛋、食用油、盐', calories: '90kcal/个', stock: 80 },
                { name: '肉夹馍', price: 8, desc: '馍酥肉香，西北风味', img: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&h=300&fit=crop', ingredients: '猪肉、面粉、香料', calories: '350kcal/个', stock: 25 },
                { name: '鸡蛋灌饼', price: 6, desc: '酥脆可口，营养均衡', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop', ingredients: '面粉、鸡蛋、生菜', calories: '280kcal/份', stock: 35 },
                { name: '豆腐脑', price: 4, desc: '嫩滑爽口，咸甜皆宜', img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop', ingredients: '黄豆、卤汁、香菜', calories: '55kcal/碗', stock: 45 }
            ],
            lunch: [
                { name: '红烧肉', price: 18, desc: '肥而不腻，入口即化', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop', ingredients: '五花肉、酱油、冰糖', calories: '520kcal/份', stock: 20 },
                { name: '宫保鸡丁', price: 15, desc: '香辣可口，下饭首选', img: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&h=300&fit=crop', ingredients: '鸡胸肉、花生、干辣椒', calories: '380kcal/份', stock: 25 },
                { name: '清蒸鲈鱼', price: 28, desc: '鲜嫩多汁，营养健康', img: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=400&h=300&fit=crop', ingredients: '鲈鱼、葱姜、蒸鱼豉油', calories: '200kcal/份', stock: 10 },
                { name: '蒜蓉西兰花', price: 12, desc: '清爽可口，绿色健康', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop', ingredients: '西兰花、蒜蓉、盐', calories: '120kcal/份', stock: 30 },
                { name: '番茄鸡蛋汤', price: 8, desc: '酸甜可口，开胃解腻', img: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop', ingredients: '番茄、鸡蛋、香菜', calories: '85kcal/碗', stock: 40 },
                { name: '牛肉面', price: 22, desc: '劲道爽滑，牛肉软烂', img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop', ingredients: '牛肉、面条、萝卜', calories: '480kcal/碗', stock: 15 },
                { name: '鸡蛋羹', price: 8, desc: '嫩滑细腻，老少皆宜', img: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=300&fit=crop', ingredients: '鸡蛋、温水、香油', calories: '110kcal/碗', stock: 35 },
                { name: '炒青菜', price: 10, desc: '清淡爽口，膳食均衡', img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop', ingredients: '时令青菜、蒜、盐', calories: '80kcal/份', stock: 40 }
            ],
            dinner: [
                { name: '糖醋排骨', price: 22, desc: '外酥里嫩，酸甜适口', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop', ingredients: '猪小排、醋、番茄酱', calories: '450kcal/份', stock: 15 },
                { name: '鱼香肉丝', price: 16, desc: '酸甜微辣，经典家常', img: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&h=300&fit=crop', ingredients: '猪肉丝、木耳、笋丝', calories: '320kcal/份', stock: 20 },
                { name: '麻婆豆腐', price: 12, desc: '麻辣鲜香，经典川菜', img: 'https://images.unsplash.com/photo-1582452919408-aca6e0106237?w=400&h=300&fit=crop', ingredients: '豆腐、肉末、豆瓣酱', calories: '210kcal/份', stock: 25 },
                { name: '酸菜鱼', price: 25, desc: '酸辣开胃，鱼肉鲜嫩', img: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=400&h=300&fit=crop', ingredients: '草鱼、酸菜、花椒', calories: '350kcal/份', stock: 12 },
                { name: '蛋炒饭', price: 10, desc: '粒粒分明，香气扑鼻', img: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop', ingredients: '米饭、鸡蛋、葱花', calories: '400kcal/份', stock: 30 },
                { name: '皮蛋瘦肉粥', price: 8, desc: '暖胃养身，鲜香可口', img: 'https://images.unsplash.com/photo-1585238341710-4d3ff484184d?w=400&h=300&fit=crop', ingredients: '大米、皮蛋、瘦肉', calories: '180kcal/碗', stock: 35 },
                { name: '回锅肉', price: 18, desc: '肥瘦相间，香辣下饭', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop', ingredients: '五花肉、蒜苗、豆瓣酱', calories: '420kcal/份', stock: 18 },
                { name: '紫菜蛋花汤', price: 6, desc: '清淡鲜美，营养丰富', img: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop', ingredients: '紫菜、鸡蛋、香油', calories: '60kcal/碗', stock: 50 }
            ]
        },
        '2': {
            breakfast: [
                { name: '牛奶', price: 4, desc: '纯牛奶，营养早餐', img: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=300&fit=crop', ingredients: '鲜牛奶', calories: '150kcal/杯', stock: 60 },
                { name: '烧饼', price: 3, desc: '芝麻香脆，传统面食', img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop', ingredients: '面粉、芝麻、食用油', calories: '280kcal/个', stock: 45 },
                { name: '馄饨', price: 8, desc: '皮薄馅鲜，汤底醇厚', img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop', ingredients: '猪肉、面粉、紫菜', calories: '260kcal/碗', stock: 30 },
                { name: '茶叶蛋', price: 3, desc: '入味醇香，蛋白Q弹', img: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=300&fit=crop', ingredients: '鸡蛋、茶叶、八角', calories: '80kcal/个', stock: 70 },
                { name: '蒸饺', price: 8, desc: '鲜香多汁，皮薄馅大', img: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&h=300&fit=crop', ingredients: '猪肉、面粉、韭菜', calories: '240kcal/份', stock: 35 },
                { name: '南瓜粥', price: 4, desc: '甘甜软糯，养胃佳品', img: 'https://images.unsplash.com/photo-1585238341710-4d3ff484184d?w=400&h=300&fit=crop', ingredients: '南瓜、大米、冰糖', calories: '90kcal/碗', stock: 40 },
                { name: '葱油饼', price: 5, desc: '层次分明，葱香四溢', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop', ingredients: '面粉、小葱、食用油', calories: '320kcal/份', stock: 30 },
                { name: '红豆包', price: 4, desc: '绵密红豆，松软面皮', img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop', ingredients: '面粉、红豆、白糖', calories: '220kcal/个', stock: 40 }
            ],
            lunch: [
                { name: '麻婆豆腐', price: 12, desc: '麻辣鲜香，经典川菜', img: 'https://images.unsplash.com/photo-1582452919408-aca6e0106237?w=400&h=300&fit=crop', ingredients: '豆腐、肉末、豆瓣酱', calories: '210kcal/份', stock: 25 },
                { name: '糖醋排骨', price: 22, desc: '外酥里嫩，酸甜适口', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop', ingredients: '猪小排、醋、番茄酱', calories: '450kcal/份', stock: 15 },
                { name: '蛋炒饭', price: 10, desc: '粒粒分明，香气扑鼻', img: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop', ingredients: '米饭、鸡蛋、葱花', calories: '400kcal/份', stock: 35 },
                { name: '酸菜鱼', price: 25, desc: '酸辣开胃，鱼肉鲜嫩', img: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=400&h=300&fit=crop', ingredients: '草鱼、酸菜、花椒', calories: '350kcal/份', stock: 12 },
                { name: '皮蛋瘦肉粥', price: 8, desc: '暖胃养身，鲜香可口', img: 'https://images.unsplash.com/photo-1585238341710-4d3ff484184d?w=400&h=300&fit=crop', ingredients: '大米、皮蛋、瘦肉', calories: '180kcal/碗', stock: 30 },
                { name: '回锅肉', price: 18, desc: '肥瘦相间，香辣下饭', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop', ingredients: '五花肉、蒜苗、豆瓣酱', calories: '420kcal/份', stock: 18 },
                { name: '鸡蛋羹', price: 8, desc: '嫩滑细腻，老少皆宜', img: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=300&fit=crop', ingredients: '鸡蛋、温水、香油', calories: '110kcal/碗', stock: 30 },
                { name: '炒青菜', price: 10, desc: '清淡爽口，膳食均衡', img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop', ingredients: '时令青菜、蒜、盐', calories: '80kcal/份', stock: 35 }
            ],
            dinner: [
                { name: '水煮牛肉', price: 28, desc: '麻辣鲜香，肉质嫩滑', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop', ingredients: '牛肉、豆芽、干辣椒', calories: '480kcal/份', stock: 10 },
                { name: '鱼香肉丝', price: 16, desc: '酸甜微辣，经典家常', img: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&h=300&fit=crop', ingredients: '猪肉丝、木耳、笋丝', calories: '320kcal/份', stock: 20 },
                { name: '担担面', price: 14, desc: '麻辣鲜香，面条劲道', img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop', ingredients: '面条、肉酱、花椒', calories: '380kcal/碗', stock: 22 },
                { name: '白切鸡', price: 25, desc: '皮爽肉滑，原汁原味', img: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=400&h=300&fit=crop', ingredients: '三黄鸡、姜葱、酱油', calories: '260kcal/份', stock: 12 },
                { name: '干锅花菜', price: 15, desc: '焦香入味，下饭神器', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop', ingredients: '花菜、五花肉、辣椒', calories: '280kcal/份', stock: 18 },
                { name: '紫菜蛋花汤', price: 6, desc: '清淡鲜美，营养丰富', img: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop', ingredients: '紫菜、鸡蛋、香油', calories: '60kcal/碗', stock: 45 },
                { name: '鸡蛋羹', price: 8, desc: '嫩滑细腻，老少皆宜', img: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=300&fit=crop', ingredients: '鸡蛋、温水、香油', calories: '110kcal/碗', stock: 30 },
                { name: '炒青菜', price: 10, desc: '清淡爽口，膳食均衡', img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop', ingredients: '时令青菜、蒜、盐', calories: '80kcal/份', stock: 40 }
            ]
        },
        '3': {
            breakfast: [
                { name: '八宝粥', price: 5, desc: '五谷杂粮，营养全面', img: 'https://images.unsplash.com/photo-1585238341710-4d3ff484184d?w=400&h=300&fit=crop', ingredients: '红豆、花生、糯米、红枣', calories: '130kcal/碗', stock: 35 },
                { name: '手抓饼', price: 6, desc: '酥脆多层，搭配蛋菜', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop', ingredients: '面粉、鸡蛋、生菜', calories: '340kcal/份', stock: 28 },
                { name: '包子', price: 5, desc: '鲜肉大包，汁水丰富', img: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&h=300&fit=crop', ingredients: '猪肉、面粉、葱姜', calories: '250kcal/个', stock: 40 },
                { name: '小米粥', price: 3, desc: '养胃佳品，清淡温润', img: 'https://images.unsplash.com/photo-1585238341710-4d3ff484184d?w=400&h=300&fit=crop', ingredients: '小米、水', calories: '60kcal/碗', stock: 50 },
                { name: '煎饺', price: 8, desc: '底脆馅鲜，金黄诱人', img: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&h=300&fit=crop', ingredients: '猪肉、面粉、韭菜', calories: '260kcal/份', stock: 25 },
                { name: '豆浆', price: 3, desc: '现磨浓香，暖胃首选', img: 'https://images.unsplash.com/photo-1571947421428-4103c3e0b9e8?w=400&h=300&fit=crop', ingredients: '黄豆、水、白糖', calories: '35kcal/杯', stock: 55 },
                { name: '鸡蛋灌饼', price: 6, desc: '酥脆可口，营养均衡', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop', ingredients: '面粉、鸡蛋、生菜', calories: '280kcal/份', stock: 30 },
                { name: '豆腐脑', price: 4, desc: '嫩滑爽口，咸甜皆宜', img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop', ingredients: '黄豆、卤汁、香菜', calories: '55kcal/碗', stock: 40 }
            ],
            lunch: [
                { name: '水煮牛肉', price: 28, desc: '麻辣鲜香，肉质嫩滑', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop', ingredients: '牛肉、豆芽、干辣椒', calories: '480kcal/份', stock: 10 },
                { name: '鱼香肉丝', price: 16, desc: '酸甜微辣，经典家常', img: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&h=300&fit=crop', ingredients: '猪肉丝、木耳、笋丝', calories: '320kcal/份', stock: 20 },
                { name: '担担面', price: 14, desc: '麻辣鲜香，面条劲道', img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop', ingredients: '面条、肉酱、花椒', calories: '380kcal/碗', stock: 22 },
                { name: '白切鸡', price: 25, desc: '皮爽肉滑，原汁原味', img: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=400&h=300&fit=crop', ingredients: '三黄鸡、姜葱、酱油', calories: '260kcal/份', stock: 12 },
                { name: '干锅花菜', price: 15, desc: '焦香入味，下饭神器', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop', ingredients: '花菜、五花肉、辣椒', calories: '280kcal/份', stock: 18 },
                { name: '紫菜蛋花汤', price: 6, desc: '清淡鲜美，营养丰富', img: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop', ingredients: '紫菜、鸡蛋、香油', calories: '60kcal/碗', stock: 45 },
                { name: '鸡蛋羹', price: 8, desc: '嫩滑细腻，老少皆宜', img: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=300&fit=crop', ingredients: '鸡蛋、温水、香油', calories: '110kcal/碗', stock: 30 },
                { name: '炒青菜', price: 10, desc: '清淡爽口，膳食均衡', img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop', ingredients: '时令青菜、蒜、盐', calories: '80kcal/份', stock: 40 }
            ],
            dinner: [
                { name: '红烧肉', price: 18, desc: '肥而不腻，入口即化', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop', ingredients: '五花肉、酱油、冰糖', calories: '520kcal/份', stock: 15 },
                { name: '宫保鸡丁', price: 15, desc: '香辣可口，下饭首选', img: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&h=300&fit=crop', ingredients: '鸡胸肉、花生、干辣椒', calories: '380kcal/份', stock: 20 },
                { name: '清蒸鲈鱼', price: 28, desc: '鲜嫩多汁，营养健康', img: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=400&h=300&fit=crop', ingredients: '鲈鱼、葱姜、蒸鱼豉油', calories: '200kcal/份', stock: 8 },
                { name: '蒜蓉西兰花', price: 12, desc: '清爽可口，绿色健康', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop', ingredients: '西兰花、蒜蓉、盐', calories: '120kcal/份', stock: 25 },
                { name: '番茄鸡蛋汤', price: 8, desc: '酸甜可口，开胃解腻', img: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop', ingredients: '番茄、鸡蛋、香菜', calories: '85kcal/碗', stock: 35 },
                { name: '牛肉面', price: 22, desc: '劲道爽滑，牛肉软烂', img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop', ingredients: '牛肉、面条、萝卜', calories: '480kcal/碗', stock: 12 },
                { name: '鸡蛋羹', price: 8, desc: '嫩滑细腻，老少皆宜', img: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=300&fit=crop', ingredients: '鸡蛋、温水、香油', calories: '110kcal/碗', stock: 30 },
                { name: '炒青菜', price: 10, desc: '清淡爽口，膳食均衡', img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop', ingredients: '时令青菜、蒜、盐', calories: '80kcal/份', stock: 35 }
            ]
        }
    };

    /* ============================================================
     * 推荐菜品数据：每个食堂每个时段精选4道招牌菜
     * ============================================================ */
    var recommendData = {
        '1': {
            breakfast: [
                { name: '小笼包', price: 10, desc: '皮薄馅多，汁水充盈', img: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&h=300&fit=crop' },
                { name: '肉夹馍', price: 8, desc: '馍酥肉香，西北风味', img: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&h=300&fit=crop' },
                { name: '豆浆', price: 3, desc: '现磨浓香，暖胃首选', img: 'https://images.unsplash.com/photo-1571947421428-4103c3e0b9e8?w=400&h=300&fit=crop' },
                { name: '鸡蛋灌饼', price: 6, desc: '酥脆可口，营养均衡', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop' }
            ],
            lunch: [
                { name: '红烧肉', price: 18, desc: '肥而不腻，入口即化', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop' },
                { name: '清蒸鲈鱼', price: 28, desc: '鲜嫩多汁，营养健康', img: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=400&h=300&fit=crop' },
                { name: '牛肉面', price: 22, desc: '劲道爽滑，牛肉软烂', img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop' },
                { name: '宫保鸡丁', price: 15, desc: '香辣可口，下饭首选', img: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&h=300&fit=crop' }
            ],
            dinner: [
                { name: '糖醋排骨', price: 22, desc: '外酥里嫩，酸甜适口', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop' },
                { name: '酸菜鱼', price: 25, desc: '酸辣开胃，鱼肉鲜嫩', img: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=400&h=300&fit=crop' },
                { name: '回锅肉', price: 18, desc: '肥瘦相间，香辣下饭', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop' },
                { name: '麻婆豆腐', price: 12, desc: '麻辣鲜香，经典川菜', img: 'https://images.unsplash.com/photo-1582452919408-aca6e0106237?w=400&h=300&fit=crop' }
            ]
        },
        '2': {
            breakfast: [
                { name: '馄饨', price: 8, desc: '皮薄馅鲜，汤底醇厚', img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop' },
                { name: '蒸饺', price: 8, desc: '鲜香多汁，皮薄馅大', img: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&h=300&fit=crop' },
                { name: '葱油饼', price: 5, desc: '层次分明，葱香四溢', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop' },
                { name: '牛奶', price: 4, desc: '纯牛奶，营养早餐', img: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=300&fit=crop' }
            ],
            lunch: [
                { name: '糖醋排骨', price: 22, desc: '外酥里嫩，酸甜适口', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop' },
                { name: '酸菜鱼', price: 25, desc: '酸辣开胃，鱼肉鲜嫩', img: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=400&h=300&fit=crop' },
                { name: '回锅肉', price: 18, desc: '肥瘦相间，香辣下饭', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop' },
                { name: '蛋炒饭', price: 10, desc: '粒粒分明，香气扑鼻', img: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop' }
            ],
            dinner: [
                { name: '水煮牛肉', price: 28, desc: '麻辣鲜香，肉质嫩滑', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop' },
                { name: '白切鸡', price: 25, desc: '皮爽肉滑，原汁原味', img: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=400&h=300&fit=crop' },
                { name: '担担面', price: 14, desc: '麻辣鲜香，面条劲道', img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop' },
                { name: '干锅花菜', price: 15, desc: '焦香入味，下饭神器', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop' }
            ]
        },
        '3': {
            breakfast: [
                { name: '八宝粥', price: 5, desc: '五谷杂粮，营养全面', img: 'https://images.unsplash.com/photo-1585238341710-4d3ff484184d?w=400&h=300&fit=crop' },
                { name: '手抓饼', price: 6, desc: '酥脆多层，搭配蛋菜', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop' },
                { name: '包子', price: 5, desc: '鲜肉大包，汁水丰富', img: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&h=300&fit=crop' },
                { name: '煎饺', price: 8, desc: '底脆馅鲜，金黄诱人', img: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&h=300&fit=crop' }
            ],
            lunch: [
                { name: '水煮牛肉', price: 28, desc: '麻辣鲜香，肉质嫩滑', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop' },
                { name: '白切鸡', price: 25, desc: '皮爽肉滑，原汁原味', img: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=400&h=300&fit=crop' },
                { name: '干锅花菜', price: 15, desc: '焦香入味，下饭神器', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop' },
                { name: '担担面', price: 14, desc: '麻辣鲜香，面条劲道', img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop' }
            ],
            dinner: [
                { name: '红烧肉', price: 18, desc: '肥而不腻，入口即化', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop' },
                { name: '清蒸鲈鱼', price: 28, desc: '鲜嫩多汁，营养健康', img: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=400&h=300&fit=crop' },
                { name: '宫保鸡丁', price: 15, desc: '香辣可口，下饭首选', img: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&h=300&fit=crop' },
                { name: '牛肉面', price: 22, desc: '劲道爽滑，牛肉软烂', img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop' }
            ]
        }
    };

    /* ============================================================
     * 消费账单模拟数据
     * 按日期、食堂区分，切换日期/食堂自动筛选
     * ============================================================ */
    var today = new Date();
    var todayStr = formatDate(today);
    var yesterdayStr = formatDate(new Date(today.getTime() - 86400000));
    var dayBeforeStr = formatDate(new Date(today.getTime() - 86400000 * 2));

    function formatDate(d) {
        return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    }

    var billData = [
        { id: 1, date: todayStr, canteen: '一食堂', dish: '红烧肉', price: 18, qty: 1 },
        { id: 2, date: todayStr, canteen: '一食堂', dish: '番茄鸡蛋汤', price: 8, qty: 1 },
        { id: 3, date: todayStr, canteen: '二食堂', dish: '糖醋排骨', price: 22, qty: 1 },
        { id: 4, date: todayStr, canteen: '二食堂', dish: '蛋炒饭', price: 10, qty: 2 },
        { id: 5, date: todayStr, canteen: '三食堂', dish: '水煮牛肉', price: 28, qty: 1 },
        { id: 6, date: todayStr, canteen: '三食堂', dish: '紫菜蛋花汤', price: 6, qty: 1 },
        { id: 7, date: yesterdayStr, canteen: '一食堂', dish: '宫保鸡丁', price: 15, qty: 1 },
        { id: 8, date: yesterdayStr, canteen: '一食堂', dish: '蒜蓉西兰花', price: 12, qty: 1 },
        { id: 9, date: yesterdayStr, canteen: '二食堂', dish: '麻婆豆腐', price: 12, qty: 1 },
        { id: 10, date: yesterdayStr, canteen: '二食堂', dish: '皮蛋瘦肉粥', price: 8, qty: 1 },
        { id: 11, date: yesterdayStr, canteen: '三食堂', dish: '鱼香肉丝', price: 16, qty: 1 },
        { id: 12, date: yesterdayStr, canteen: '三食堂', dish: '担担面', price: 14, qty: 1 },
        { id: 13, date: dayBeforeStr, canteen: '一食堂', dish: '清蒸鲈鱼', price: 28, qty: 1 },
        { id: 14, date: dayBeforeStr, canteen: '二食堂', dish: '酸菜鱼', price: 25, qty: 1 },
        { id: 15, date: dayBeforeStr, canteen: '三食堂', dish: '白切鸡', price: 25, qty: 1 },
        { id: 16, date: dayBeforeStr, canteen: '三食堂', dish: '干锅花菜', price: 15, qty: 1 }
    ];

    var currentCanteen = '1';
    var currentMeal = 'lunch';
    var currentBillDate = todayStr;
    var nextBillId = 17;

    /* ============================================================
     * 渲染推荐菜品（横向滚动卡片）
     * ============================================================ */
    function renderRecommend() {
        var wrap = document.getElementById('recommendScroll');
        var items = (recommendData[currentCanteen] || {})[currentMeal] || [];
        wrap.innerHTML = items.map(function(item) {
            return '<div class="recommend-card">' +
                '<div class="recommend-img-wrap">' +
                '<img src="' + item.img + '" alt="' + item.name + '" onerror="this.src=\'https://via.placeholder.com/300x200/e2e8f0/64748b?text=' + encodeURIComponent(item.name) + '\'">' +
                '</div>' +
                '<div class="recommend-info">' +
                '<h4>' + item.name + '</h4>' +
                '<p>' + item.desc + '</p>' +
                '<span class="recommend-price">¥' + item.price + '</span>' +
                '</div></div>';
        }).join('');
    }

    /* ============================================================
     * 渲染菜品卡片列表（纯浏览，无点餐按钮）
     * ============================================================ */
    function renderMenu() {
        var grid = document.getElementById('menuGrid');
        var canteen = canteenData[currentCanteen];
        if (!canteen) return;
        var items = canteen[currentMeal] || [];
        grid.innerHTML = items.map(function(item, idx) {
            return '<div class="menu-item" data-idx="' + idx + '">' +
                '<div class="menu-img-wrap">' +
                '<img src="' + item.img + '" alt="' + item.name + '" onerror="this.src=\'https://via.placeholder.com/400x300/e2e8f0/64748b?text=' + encodeURIComponent(item.name) + '\'">' +
                '</div>' +
                '<div class="menu-info">' +
                '<h4>' + item.name + '</h4>' +
                '<p>' + item.desc + '</p>' +
                '<div class="menu-bottom">' +
                '<span class="menu-price-tag">¥' + item.price + '</span>' +
                '</div></div></div>';
        }).join('');

        /* 点击卡片打开详情弹窗 */
        grid.querySelectorAll('.menu-item').forEach(function(card) {
            card.addEventListener('click', function() {
                var idx = parseInt(this.getAttribute('data-idx'));
                var item = canteenData[currentCanteen][currentMeal][idx];
                openDishModal(item);
            });
        });
    }

    /* ============================================================
     * 菜品详情弹窗（仅浏览，无加购功能）
     * ============================================================ */
    function openDishModal(item) {
        document.getElementById('dishModalImg').innerHTML = '<img src="' + item.img + '" alt="' + item.name + '" onerror="this.src=\'https://via.placeholder.com/600x400/e2e8f0/64748b?text=' + encodeURIComponent(item.name) + '\'">';
        document.getElementById('dishModalName').textContent = item.name;
        document.getElementById('dishModalDesc').textContent = item.desc;
        document.getElementById('dishModalIngredients').textContent = item.ingredients;
        document.getElementById('dishModalCalories').textContent = item.calories;
        document.getElementById('dishModalStock').textContent = item.stock > 0 ? '剩余 ' + item.stock + ' 份' : '已售罄';
        document.getElementById('dishModalPrice').textContent = '¥' + item.price;
        document.getElementById('dishModal').classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeDishModal() {
        document.getElementById('dishModal').classList.remove('active');
        document.body.style.overflow = '';
    }

    /* ============================================================
     * 消费账单渲染
     * ============================================================ */
    function renderBill() {
        var tbody = document.getElementById('billTableBody');
        var emptyEl = document.getElementById('billEmpty');
        var summaryEl = document.getElementById('billSummary');

        /* 按日期筛选 */
        var filtered = billData.filter(function(b) { return b.date === currentBillDate; });

        if (filtered.length === 0) {
            tbody.innerHTML = '';
            emptyEl.style.display = '';
            summaryEl.style.display = 'none';
            return;
        }

        emptyEl.style.display = 'none';
        summaryEl.style.display = 'flex';

        var totalCount = 0;
        var totalAmount = 0;

        tbody.innerHTML = filtered.map(function(b) {
            var subtotal = b.price * b.qty;
            totalCount += 1;
            totalAmount += subtotal;
            return '<tr>' +
                '<td>' + b.date + '</td>' +
                '<td>' + b.canteen + '</td>' +
                '<td>' + b.dish + '</td>' +
                '<td>¥' + b.price.toFixed(2) + '</td>' +
                '<td>' + b.qty + '</td>' +
                '<td class="bill-subtotal">¥' + subtotal.toFixed(2) + '</td>' +
                '<td><button class="bill-delete-btn" data-id="' + b.id + '"><i class="fas fa-trash-alt"></i></button></td>' +
                '</tr>';
        }).join('');

        document.getElementById('billTotalCount').textContent = totalCount + ' 笔';
        document.getElementById('billTotalAmount').textContent = '¥' + totalAmount.toFixed(2);

        /* 单条删除 */
        tbody.querySelectorAll('.bill-delete-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var id = parseInt(this.getAttribute('data-id'));
                billData = billData.filter(function(b) { return b.id !== id; });
                renderBill();
                showToast('已删除该条账单记录');
            });
        });
    }

    /* Toast 提示 */
    function showToast(msg) {
        var toast = document.createElement('div');
        toast.style.cssText = 'position:fixed;top:80px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#1e40af,#3b82f6);color:#fff;padding:12px 24px;border-radius:25px;font-size:14px;font-weight:600;z-index:99999;animation:fadeInUp 0.3s ease';
        toast.textContent = msg;
        document.body.appendChild(toast);
        setTimeout(function() { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.3s'; }, 1500);
        setTimeout(function() { if (toast.parentNode) document.body.removeChild(toast); }, 1800);
    }

    /* ============================================================
     * 事件绑定
     * ============================================================ */
    document.addEventListener('DOMContentLoaded', function() {
        /* 初始化日期选择器 */
        var dateInput = document.getElementById('billDateInput');
        dateInput.value = todayStr;

        renderRecommend();
        renderMenu();
        renderBill();

        /* 食堂切换 */
        document.getElementById('canteenTabs').addEventListener('click', function(e) {
            if (e.target.classList.contains('tab-btn')) {
                document.querySelectorAll('#canteenTabs .tab-btn').forEach(function(t) { t.classList.remove('active'); });
                e.target.classList.add('active');
                currentCanteen = e.target.getAttribute('data-canteen');
                renderRecommend();
                renderMenu();
            }
        });

        /* 时段切换 */
        document.getElementById('mealTabs').addEventListener('click', function(e) {
            var btn = e.target.closest('.tab-btn');
            if (!btn) return;
            document.querySelectorAll('#mealTabs .tab-btn').forEach(function(t) { t.classList.remove('active'); });
            btn.classList.add('active');
            currentMeal = btn.getAttribute('data-meal');
            renderRecommend();
            renderMenu();
        });

        /* 日期筛选 */
        dateInput.addEventListener('change', function() {
            currentBillDate = this.value;
            renderBill();
        });

        /* 清空当日账单 */
        document.getElementById('billClearAllBtn').addEventListener('click', function() {
            var filtered = billData.filter(function(b) { return b.date === currentBillDate; });
            if (filtered.length === 0) {
                showToast('当日暂无账单记录');
                return;
            }
            billData = billData.filter(function(b) { return b.date !== currentBillDate; });
            renderBill();
            showToast('已清空 ' + currentBillDate + ' 的全部账单');
        });

        /* 菜品详情弹窗：关闭 */
        document.getElementById('dishModalClose').addEventListener('click', closeDishModal);
        document.getElementById('dishModal').addEventListener('click', function(e) {
            if (e.target === this) closeDishModal();
        });
    });
})();
