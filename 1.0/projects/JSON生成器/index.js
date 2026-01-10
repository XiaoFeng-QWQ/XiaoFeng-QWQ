function clearFields() {
    //清空字段区域的内容
    var fieldsDiv = document.getElementById('fields');
    fieldsDiv.innerHTML = '';
}

function createElement(type, attributes) {
    //创建指定类型的元素，并设置属性
    var element = document.createElement(type);
    for (var attr in attributes) {
        if (attributes.hasOwnProperty(attr)) {
            element.setAttribute(attr, attributes[attr]);
        }
    }
    return element;
}

function addFieldElement(type, attributes) {
    //向字段区域添加指定类型和属性的元素
    var fieldsDiv = document.getElementById('fields');
    var element = createElement(type, attributes);
    fieldsDiv.appendChild(element);
}

function handleInputType(type) {
    //添加文本输入框
    console.debug('选择了:', type);
    switch (type) {
        case 'text':

            addFieldElement('input', {
                type: 'text',
                class: 'mdui-textfield-input',
                id: 'text',
                placeholder: '请输入文本内容'
            });
            break;
        case 'score':
            addFieldElement('input', {
                type: 'text',
                class: 'mdui-textfield-input',
                id: 'name',
                placeholder: '请输入目标'
            });
            addFieldElement('input', {
                type: 'text',
                class: 'mdui-textfield-input',
                id: 'objective',
                placeholder: '请输入计分板名称'
            });
            break;
        case 'selector':
            addFieldElement('input', {
                type: 'text',
                class: 'mdui-textfield-input',
                id: 'selector',
                placeholder: '请输入选择器'
            });
            break;
        case 'translate':
            addFieldElement('input', {
                type: 'text',
                class: 'mdui-textfield-input',
                id: 'translate',
                placeholder: '请输入翻译字符'
            });
            break;
        default:
            break;
    }
}

function showFields() {
    //根据选择的类型显示对应的字段
    var type = document.getElementById('type').value;
    clearFields();
    handleInputType(type);
}

function generateJSON() {
    //生成 JSON 数据
    var type = document.getElementById('type').value;
    var outputDiv = document.getElementById('output');
    var jsonString = outputDiv.textContent;
    var jsonObject;

    //检查输出区域是否已经存在 JSON 数据
    if (jsonString.trim() !== '') {
        try {
            jsonObject = JSON.parse(jsonString);
        } catch (error) {
            console.error('Invalid JSON:', error);
            return;
        }
    } else {
        //如果输出区域为空，则创建一个包含空数组的 JSON 对象
        jsonObject = {
            "rawtext": []
        };
    }

    //检查 JSON 对象是否包含 rawtext 属性
    if (!jsonObject.hasOwnProperty("rawtext")) {
        jsonObject.rawtext = [];
    }

    //获取文本输入框的值，并添加到 rawtext 数组中
    var value;
    switch (type) {
        case 'text':
            value = document.getElementById('text').value;
            jsonObject.rawtext.push
                (
                    {
                        "text": value
                    }
                )
                ;
            console.log('生成了:文本');
            break;
        case 'score':
            var name = document.getElementById('name').value;
            var objective = document.getElementById('objective').value;
            value =
            {
                "name": name,
                "objective": objective
            }
                ;
            jsonObject.rawtext.push
                (
                    {
                        "score": value
                    }
                )
                ;
            console.log('生成了:计分');
            break;
        case 'selector':
            value = document.getElementById('selector').value;
            jsonObject.rawtext.push
                (
                    {
                        "selector": value
                    }
                )
                ;
            console.log('生成了:选择器');
            break;
        case 'translate':
            value = document.getElementById('translate').value;
            jsonObject.rawtext.push
                (
                    {
                        "translate": value
                    }
                )
                ;
            console.log('生成了:翻译字符');
            break;
        case 'wrap':
            value = document.getElementById('type').value;
            jsonObject.rawtext.push
                (
                    {
                        "translate": "\n"
                    }
                )
                ;
            break;
        default:
            break;
    }

    //将 JSON 对象转换为字符串，并显示在输出区域中
    function updateCode(code, language) {
        var output = document.getElementById('output');
        output.innerHTML = code;
        output.className = 'language-' + language;
        Prism.highlightElement(output);
    }

    // 将 JSON 对象转换为字符串，并设置为代码内容
    var jsonString = JSON.stringify(jsonObject, null, 2);
    updateCode(jsonString, 'json');
}