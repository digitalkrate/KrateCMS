$(function() {
  // $('.button-collapse').sideNav({
  //   edge: 'left',
  //   closeOnClick: true
  // });
  $('[data-toggle="tooltip"]').tooltip();
  $('.fixed-action-btn').off();

  $('body').on('click', '[data-href]', function(e) {
    e.preventDefault();

    const $this = $(this);
    const href = $this.data('href');
    const takeItSlow = !!$this.data('href-slow');

    if(takeItSlow) return window.location.assign(href);

    $('main').load(href + '?view', function() {
      window.history.pushState('', '', href);
    });
  });

  function formatColumnName(name) {
    let newName = name.charAt(0).toUpperCase();
    let newNameIndex = 1;
    for (let i = 1; i < name.length; i++) {
      const prev = name.charAt(i - 1);
      let char = name.charAt(i);

      if(prev === '-' || prev === '_') {
        newName = newName.slice(0, -1);
        char = ' ' + char.toUpperCase();
      } else if(char === char.toUpperCase() && newName.charAt(newNameIndex) !== ' ') {
        char = ' ' + char;
        newNameIndex++;
      }

      newName += char;
      newNameIndex++;
    }

    return newName;
  }

  $('table.autoload').each(function() {
    const $table = $(this);
    let $tbody = $table.find('tbody');
    let $thead = $table.find('thead');
    let $theadRow = $thead.find('tr');

    if($tbody.length < 1) $table.append($tbody = $('<tbody>'));
    if($thead.length < 1) $table.prepend($thead = $('<thead>'));
    if($theadRow.length < 1) $thead.append($theadRow = $('<tr>'));


    if(!$table.data('url')) return;

    const method = $table.data('method') || 'GET';
    let goto = $table.data('goto') || null;
    let allowedColumns = $table.data('columns') || null;
    const gotoFast = !!$table.data('goto-fast');

    if(allowedColumns) allowedColumns = allowedColumns.split(',');

    $.ajax({
      url: $table.data('url'),
      type: method
    }).done(function(data) {
      if(!data) return;

      let columns = {};
      let $rowTemplate = $('<tr>');

      if(allowedColumns) {
        allowedColumns.forEach((column, index) => {
          if(typeof columns[column] === 'undefined') {
            columns[column] = index;
            $rowTemplate.append($('<td>').attr('col', column));
            $theadRow.append($('<td>').text(formatColumnName(column)));
          }
        });
      } else {
        data.forEach(item => {
          Object.keys(item).forEach((key, index) => {
            if(typeof columns[key] === 'undefined') {
              columns[key] = index;
              $rowTemplate.append($('<td>').attr('col', key));
            }
          });
        });
      }

      data.forEach(item => {
        const $row = $rowTemplate.clone();
        let url = goto.replace('', ''); // Clone the variable
        Object.keys(item).forEach((key, index) => {
          let value = item[key];

          if(allowedColumns) {
            if(!allowedColumns.includes(key)) return;

            index = allowedColumns.findIndex(val => {
              if(val === key) return true;
            });
          }

          $row.find('td').eq(index).text(value);

          if(goto) url = url.replace('$' + key, value);
        });

        if(goto) {
          url = url.replace('//', '/');
          $row.attr('data-href', url);
          if(!gotoFast) $row.attr('data-href-slow', 'true');
        }
        $tbody.append($row);
        $table.trigger('row:drawn', [$row, item]);
      });

	    $table.trigger('rendered');
    });
  });

  $('.editor *').each(function() {
    const $this = $(this);
    $this.draggable({
      appendTo: "body",
      cursor: "move",
      helper: 'clone',
      revert: "invalid"
    });
  });
  $('.editor div').each(function() {
    const $this = $(this);
    $this.droppable({
      tolerance: "intersect",
      // accept: ".card",
      activeClass: "ui-state-default",
      hoverClass: "ui-state-hover",
      drop: function(event, ui) {
        $this.append($(ui.draggable));
      },
      over: function(e, ui) {
        // console.log(ui.offset);
        // console.log($this.offset());
        // $this.before($('<div>').addClass('vert-indicator'));
        $this.addClass('indicate right');
      },
      out: function(e, ui) {
        $this.removeClass('indicate left right');
      }
    });
  });

  $('#_users').on('row:drawn', (e, $row, data) => {
    const $badgesCol = $row.find('[col="badges"]');
    const $badgeTemplate = $('<span>').addClass('badge');

    let badgeText;
    let badgeClass = '';
    switch(data.permissions.extends) {
      case 'defaults.owner':
        badgeText = 'Owner';
        badgeClass = 'orange';
        break;
      case 'defaults.administrator':
        badgeText = 'Admin';
        badgeClass = 'purple';
        break;
    }
    if(badgeText) {
      $badgesCol.append($badgeTemplate.clone().text(badgeText).addClass(badgeClass));
    }

    const $nameCol = $row.find('[col="name"]');
    $nameCol.text(data.givenName + ' ' + data.familyName);
  });
});
