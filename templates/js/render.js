getMenuBar = function(structure){


  var allQueues = structure.all_prefixes

  var menuBar = $('<nav id="topNavBar" class="navbar navbar-primary" role="navigation">')
  
  var barContainer = $('<div class="container-fluid">')
  menuBar.append(barContainer)
  
  var navBarCollapse = $('<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">')
  barContainer.append(navBarCollapse)
  
  var navBarUl = $('<ul class="nav navbar-nav">')
  navBarCollapse.append(navBarUl)


  for(var i = 0; i < allQueues.length; i++){

    addDropDownList(navBarUl,allQueues[i],structure[allQueues[i]])

  }

  return menuBar

}                                                                                                                                                                                                                                                                                                                                                                               
addDropDownList = function(navBarUl,releaseName,releaseQueues){

  var liRelName = $('<li class="dropdown">')
  linkTittle = $('<a href="#" class="dropdown-toggle" data-toggle="dropdown">').text(releaseName)
  linkTittle.append( $('<b class="caret">'))
  liRelName.append(linkTittle)
  navBarUl.append(liRelName)

  var dropDownMenu = $('<ul class="dropdown-menu">')
  liRelName.append(dropDownMenu)

  for (var i = 0; i < releaseQueues.length; i++){
    
    var releaseQueue = releaseQueues[i]
    var link = $('<a>').text(releaseQueue).attr("href", '#'+releaseQueue)
    var liReleaseQueue = $('<li>').append(link)


    link.click(function (e) {
                             e.preventDefault()
		             var tab = $(this).attr('href')
		             $('#myTab a[href='+tab+']').tab('show') 

                         })

    dropDownMenu.append(liReleaseQueue)
    liReleaseQueue = null

  }

}

//------------------------------------------------------------------
////-- Write tests results
////-----------------------------------------------------------------


add_qa_link_to_row = function(row, arch,release_name){
  
  var result_cell = $('<td></td>')
  var url = 'http://cmssdt.cern.ch/SDT/cgi-bin//newQA.py?arch='+arch+'&release='+release_name
  var r_link = $("<a></a>").attr("href", url)
  var label_link = $("<span></span>")
  
  r_link.append(label_link)
  label_link.attr("class", "glyphicon glyphicon-search")
  result_cell.append(r_link)
  row.append(result_cell)


}
/**
 * returns the url for the tests, type can be unit tests, relvals or addons
 */
get_tests_url = function(type,file) {
  var link_parts = file.split('/')
         
  var details_link = ""
  if (type == 'utests' || type =='builds'){
    details_link="https://cmssdt.cern.ch/SDT/cgi-bin/showBuildLogs.py/" + link_parts[6] + '/'
                                                                +link_parts[7]+'/'+link_parts[8]+'/'+link_parts[9]
                                                                +'/'+link_parts[10]

  }else if(type == 'relvals'){
    details_link="https://cms-sw.github.io/relvalLogDetail.html#" + link_parts[6] + ';' + link_parts[10] 
  }else if(type == 'addons'){
    details_link = "https://cmssdt.cern.ch/SDT/cgi-bin//showAddOnLogs.py/" + link_parts[6] + '/'
                                                                +link_parts[7]+'/'+link_parts[8]+'/'+link_parts[9]+'/'+link_parts[10]
                                                                +'/'+'addOnTests'+'/'

  }

  return details_link



}

get_result_tests =  function (arch,tests){
  for(var i = 0; i<tests.length; i++){
    if (tests[i].arch == arch){
      return tests[i]
    }                       
  }
}

/**
 * Adds the results of the tests to a row of the table
 */
add_tests_to_row = function(tests,row,arch,type){


  // just add a blank cell if tere are no results for that kind of tests

  if (tests.length == 0){
    var result_cell = $('<td></td>')
    row.append(result_cell)
    return
  }

  var result = null
  var file = null
  var testDetails = null
  var result_cell = $('<td></td>')
  var result_tests = get_result_tests(arch,tests)
  
  if(result_tests != null){
    result = result_tests.passed
    testDetails = result_tests.details
    file = result_tests.file

  }
  //just add a blank cell if I didn't find any results for that arch
  if (result == null || file == null){
    var result_cell = $('<td></td>')
    row.append(result_cell)
    return
  }
 
                                                                                                     
  var r_class = ""
  var test_label = "See Details"

  if(type == 'utests'){
    
    if (result == 'passed'){
      r_class = "label label-success"
      test_label = 'See Details'
    }else if (result == 'failed'){
      r_class = "label label-danger"
      test_label = testDetails.num_fails + " Tests Failing"
    }else{
      r_class = "label label-default"
      test_label = "Unknown"
    }
   
  }else if (type == 'builds'){

    if (result == 'passed'){
      r_class = "label label-success"
      test_label = 'See Details'
    }else if (result == 'warning'){
      r_class = "label label-warning"
      test_label = testDetails.compWarning + " Warnings"
    }else{
      r_class = "label label-danger"
      var compError = testDetails.compError != null ? testDetails.compError : 0
      var linkError = testDetails.linkError != null ? testDetails.linkError : 0
      var miscError = testDetails.miscError != null ? testDetails.miscError : 0
      test_label = ( compError + linkError + miscError ) + " Errors"
    }
  }else if (type == 'relvals'){

      r_class = result? "label label-success" : "label label-danger"

      if ( result ){

        r_class = "label label-success"
        test_label = "See Details"

      }else{

        r_class = "label label-danger"
        test_label = "Pass: " + testDetails.num_passed + " Fail: " + testDetails.num_failed
      }


  }else{
      r_class = result? "label label-success" : "label label-danger"
  }

  var res_label = $('<span></span>')
  res_label.append($('<small></small>').text(test_label))


  res_label.attr("class", r_class)
  var link_parts = file.split('/')
  var details_url = get_tests_url(type,file)
  var r_link = $("<a></a>").attr("href", details_url)

  r_link.append(res_label)
  result_cell.append(r_link) 

  row.append(result_cell)

}


add_static_analyzer_link = function (title_cell,url){
  if (url != ''){
    var sa_link = $("<a></a>").attr("href", url)
    sa_link.append($('<span class="glyphicon glyphicon-eye-open"></span>'))
    sa_link.append($('<span></span>').text(' Static Analyzer'))
    title_cell.append(sa_link)
    title_cell.append($("<br>"))

    var sa2_link = $("<a></a>").attr("href", url.replace("llvm-analysis/index.html", "reports/modules2statics.txt"))
    sa2_link.append($('<span></span>').text(' Modules to thread unsafe statics'))
    title_cell.append(sa2_link)

    title_cell.append($("<br>"))

    var sa3_link = $("<a></a>").attr("href", url.replace("llvm-analysis/index.html", "reports/tlf2esd.txt"))
    sa3_link.append($('<span></span>').text(' Modules to thread unsafe EventSetup products'))
    title_cell.append(sa3_link)
  }
}

add_hlt_tests_link = function (title_cell,url){
  if (url != ''){
    var sa_link = $("<a></a>").attr("href", url)
    sa_link.append($('<span class="glyphicon glyphicon-list-alt"></span>'))
    sa_link.append($('<span></span>').text(' HLT Validation'))
    title_cell.append(sa_link)
  }
}


/**
 * writes a table with the comparison lates tag, and the information about the IB if it is an IB
 */
write_comp_IB_table =  function(comparison , tab_pane){

  var current_tag = comparison.compared_tags.split("-->")[1]
  var title_compared_tags = $("<h3><b></b></h3>").text(current_tag)
 
  title_compared_tags.append($("<br>"))
  title_compared_tags.append($("<br>"))
   
  var title_table = $('<table class="table table-condensed"></table>')
  title_table.attr( 'id' , current_tag )
  var title_cell = $('<td></td>').append(title_compared_tags)
  //here I check the result of the relvals
  
  add_static_analyzer_link(title_cell,comparison.static_checks)
  title_cell.append($('<br>'))
  add_hlt_tests_link(title_cell,comparison.hlt_tests)

  var title_row = $('<tr></tr>')
  var relvals_results = comparison.relvals
  var uTests_results = comparison.utests
  var addons_results = comparison.addons
  var architectures = comparison.tests_archs
  var building_results =  comparison.builds

  title_cell.attr("rowspan",architectures.length+1)
  title_row.append(title_cell)
  title_table.append(title_row)
  
  if (architectures.length != 0 ){
    
    var archs_title = $('<th></th>').text('Architectures')
    title_row.append(archs_title)
    var builds_title = $('<th></th>').text('Builds')
    title_row.append(builds_title)
    var utests_title = $('<th></th>').text('Unit Tests')
    title_row.append(utests_title)
    var rvs_title = $('<th></th>').text('RelVals')
    title_row.append(rvs_title)
    var addons_title = $('<th></th>').text('Other Tests')
    title_row.append(addons_title)
    var qa_title = $('<th></th>').text('Q/A')
    title_row.append(qa_title)
    
    for( var i = 0; i < architectures.length; i++){
      
      var ar_row = $('<tr></tr>')
      var ar_cell = $('<td></td>')
      fill_arch_cell( ar_cell , architectures[ i ] , comparison.cmsdistTags , current_tag )
      ar_row.append(ar_cell)
      add_tests_to_row(building_results,ar_row, architectures[i],'builds')
      add_tests_to_row(uTests_results,ar_row, architectures[i],'utests')
      add_tests_to_row(relvals_results,ar_row,architectures[i],'relvals')
      add_tests_to_row(addons_results,ar_row,architectures[i],'addons')
      add_qa_link_to_row(ar_row,architectures[i],current_tag)
      title_table.append(ar_row)
     }

  }

  tab_pane.append(title_table)

}

/**
 * fills the arch cell with a link to the cmsdist tag used to build that IB if 
 * the tag exsists, current_tag is the current IB being processed
 */
fill_arch_cell = function( cell , architecture , cmsdistTags , current_tag ){

  // if there is no information about the tag I only add text
  if( cmsdistTags[ architecture ] == null ){
    cell.text( architecture )
  }else{
    
    var tagName = cmsdistTags[ architecture ]
    var intendedTagName = 'IB/'.concat( current_tag ,'/', architecture )
    var link = $( '<a>' )
    link.attr( 'href' , 'https://github.com/cms-sw/cmsdist/commits/' + tagName )
    var tooltipText = ''
    
    if( tagName == 'Not Found' ){
      cell.text( architecture )
      return      
    }else if ( tagName != intendedTagName ){
      tooltipText = 'Used same cmsdist tag as ' + tagName.replace( 'IB/' , '').replace( '/' + architecture , '')
    }else { 

      tooltipText = 'See cmsdist tag used for this build'

    }

 
    link.text( architecture )
    cell.append( link ).attr( 'data-toggle' , 'tooltip' )
    cell.append( link ).attr( 'data-placement' , 'right' )
    cell.append( link ).attr( 'title' , tooltipText )

  }

}


//----------------------------------------------------------
//-- Write merged prs
//----------------------------------------------------------
write_merge_commit = function(merge_commit,pr_list_group){

  var list_item = $('<li>')
  var item_link_text = merge_commit.number
  var merge_description = " Automatic merge of "

  for( var i = 0; i < merge_commit.brought_prs.length ; i++){
    merge_description += '#'.concat( merge_commit.brought_prs[i] , ' ' )
  }


  var merge_link_address = "https://github.com/cms-sw/cmssw/commit/".concat(merge_commit.hash)
  var merge_link = $("<a>").attr("href", merge_link_address)
  merge_link.append($("<span>").text(item_link_text))
  list_item.append(merge_link)

  var fromMergeGlyph = $('<span class="glyphicon glyphicon-transfer">')
  list_item.append(fromMergeGlyph)

  list_item.append($("<span>").text(merge_description))
  pr_list_group.append(list_item)



}

write_pr = function(pr,pr_list_group){

  var list_item = $('<li>')
  var item_link_text = "#".concat(pr.number)
  var pr_description = " from ".concat(pr.author_login,": ", pr.title)
  
  var pr_link_address = pr.url
  var pr_link = $("<a>").attr("href", pr_link_address)
  pr_link.append($("<span>").text(item_link_text))
  list_item.append(pr_link)

  if (pr.from_merge_commit){

    var fromMergeGlyph = $('<span class="glyphicon glyphicon-transfer">')
    list_item.append(fromMergeGlyph)
  }
  
  list_item.append($("<span>").text(pr_description))
  pr_list_group.append(list_item)

}


/**
*This function generates the comparison link on github
*/
writeComparisonLinkGithub = function(comparedTags, tab_pane){
  
  var prev_tag = comparedTags.split("-->")[0]
  var comp_link_address = comparedTags.replace("-->","...")
  
  comp_link_address = "https://github.com/cms-sw/cmssw/compare/".concat(comp_link_address)
  var comp_link = $("<a>").attr("href", comp_link_address)
  comp_link.append($("<span>").text("See comparison with "+prev_tag+" on GitHub"))
  var see_on_github = $("<small>").append(comp_link)
  tab_pane.append(see_on_github)
  tab_pane.append($("<br>"))
  tab_pane.append($("<br>"))
}

/*
*
* This function writes on the page the pull requests involved in the comparison between 2 tags
*/
write_comparison = function(comparison,tab_pane){

  var compTags = comparison.compared_tags
  write_comp_IB_table(comparison,tab_pane)
  var pull_requests = comparison.merged_prs

  //if there were not merged prs in this comparison I alert it

  if(comparison.merged_prs.length!=0){
    
    writeComparisonLinkGithub(compTags,tab_pane)
    var pr_list_group = $('<ul>')

    //write the info for each pull request
    for(var i =0; i < pull_requests.length; i++){

      if(pull_requests[i].is_merge_commit){
        write_merge_commit(pull_requests[i],pr_list_group)
      }else{ 
        write_pr(pull_requests[i],pr_list_group)
      }
    
    }

    tab_pane.append(pr_list_group)

  }else{

    var prevTag = compTags.split("-->")[0]
    var no_prs_found = $('<ul>').append($('<li>').text('No new pull requests since '+prevTag))
    tab_pane.append(no_prs_found)

  }

  tab_pane.append($("<br>"))


}


/**
 * loads the comparisons and adds it to the tab pane for the corresponding release queue
 */
paintComparisons = function(rqInfo){

  var tab_pane = $("#"+rqInfo.release_name)
  var comparisons = rqInfo.comparisons

  for(var j =comparisons.length-1; j >= 0; j--){
    write_comparison(comparisons[j],tab_pane)
  
  }

  checkHasToScroll( rqInfo.release_name )

}


//------------------------------------------------------------------------------------
// Hash
//----------------------------------------------------------------------------------

checkHasToScroll = function ( releaseName ){
   
  var url = document.location.toString();
  console.log( 'option2' )
  var hash = url.split('#')[1]
  var requiredReleaseName = hash.substring( 0 , hash.lastIndexOf( '_' ) )
  var lastChar = requiredReleaseName.charAt( requiredReleaseName.length - 1 )

  // they are asking for an IB
  if ( lastChar == 'X' || lastChar == 'C' ){

    if( releaseName == requiredReleaseName ){

      $('html, body').animate({
          scrollTop: $( '#' + hash ).offset().top
      }, 1000);

    }
                                
  }

}


