{% assign stripped_page_url = page.url | replace: 'index.html', '' %}
{% assign parts = stripped_page_url | split: '/' %}
{% assign current = false %}
{% if menu_item.url == page.url or menu_item.url == stripped_page_url %}
    {% assign current = 'current' %}
{% else %}
    {% for part in parts %}
        {% unless current %}
            {% assign check_against_this = '' %}
            {% for i in (1..forloop.index) %}
                {% assign check_against_this = check_against_this | append: '/' | append: parts[i] %}
                {% if menu_item.url == check_against_this %}
                    {% assign check_against_this = check_against_this | append: '/' %}
                    {% if stripped_page_url == check_against_this %}
                        {% assign current = 'current' %}
                    {% else %}
                        {% assign current = 'path' %}
                    {% endif %}
                {% endif %}
            {% endfor %}
        {% endunless %}
    {% endfor %}
{% endif %}
